from datetime import datetime, timedelta
from io import BytesIO
import xlsxwriter
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen
from config import Config
from sqlalchemy import func

from api import models

MAX_COLUMN = 10


def sheet_bottom(
        worksheet, charity_by_year, charity_by_week, last_row, total_week, total_year, merge_format,
        merge_format_top, merge_format_right, merge_format_top_right):
    for charity_id, value in charity_by_year.items():
        if charity_id not in charity_by_week:
            for j in range(MAX_COLUMN):
                worksheet.write(last_row, j, '', merge_format)
            worksheet.merge_range(last_row, 1, last_row, 3, value['name'], merge_format)
            worksheet.write(last_row, 8, f"$ {round(value['donat_amount'], 2)}", merge_format_right)
            last_row += 1
    for i in range(7):
        for j in range(MAX_COLUMN):
            worksheet.write(last_row + i, j, '', merge_format)
    worksheet.write(last_row, 7, f"$ {round(total_week, 2)}", merge_format_top_right)
    worksheet.write(last_row, 8, f"$ {round(total_year, 2)}", merge_format_top_right)
    last_row += 2
    worksheet.write(last_row, 1, 'Payment method', merge_format)
    worksheet.write(last_row, 4, 'Credit Card', merge_format)
    last_row += 2
    worksheet.merge_range(last_row, 1, last_row, 8,
                          "Thank you for supporting Australian charities and not for profit organisations. The impact you've made really does create Change for Change.",
                          merge_format_top)


def generate_customer_tax_receipt(customer):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})

    merge_format = workbook.add_format({
        'align': 'left', 'bg_color': 'white', 'font_name': 'Roboto'
    })
    merge_format_bold = workbook.add_format({
        'align': 'left', 'bg_color': 'white', 'bold': True, 'font_name': 'Roboto',
    })
    merge_format_bold_center = workbook.add_format({
        'align': 'center', 'bg_color': 'white', 'bold': True, 'font_name': 'Roboto',
    })
    merge_format_bold_title = workbook.add_format({
        'align': 'left', 'bg_color': 'white', 'bold': True, 'font_size': 14, 'font_name': 'Roboto',
    })
    merge_format_top = workbook.add_format({
        'align': 'left', 'bg_color': 'white', 'font_name': 'Roboto', 'top': 2, 'font_size': 9,
    })
    merge_format_bottom = workbook.add_format({
        'align': 'left', 'bg_color': 'white', 'bottom': True,
    })
    merge_format_right = workbook.add_format({
        'align': 'right', 'bg_color': 'white', 'font_name': 'Roboto'
    })
    merge_format_top_right = workbook.add_format({
        'align': 'right', 'bg_color': 'white', 'font_name': 'Roboto', 'top': 2
    })
    date_format = workbook.add_format({
        'num_format': 'd mmmm yyyy', 'align': 'left', 'bg_color': 'white', 'color': 'gray', 'font_name': 'Roboto',
    })

    first_day_of_year = datetime.today().replace(day=1, month=7)
    donations = models.TransferDonation.query.filter(
        models.TransferDonation.customer_id == customer.id,
        models.TransferDonation.created_at >= first_day_of_year
    ).order_by(
        models.TransferDonation.created_at.asc()
    ).all()

    sheet_name = None
    charity_by_year = {}
    total_week = 0.0
    total_year = 0.0
    sheet_name = None
    worksheet = None
    last_row = 0
    charity_by_week = []
    for donation in donations:
        if not sheet_name or donation.created_at.date() != sheet_name:
            if sheet_name:
                sheet_bottom(worksheet, charity_by_year, charity_by_week, last_row, total_week,
                             total_year, merge_format, merge_format_top, merge_format_right, merge_format_top_right)

            sheet_name = donation.created_at.date()
            worksheet = workbook.add_worksheet(sheet_name.strftime('%d-%m-%Y'))
            total_week = 0.0
            charity_by_week = []

            for i in range(19):
                for j in range(MAX_COLUMN):
                    worksheet.write(i, j, '', merge_format)
            worksheet.set_column(1, 5, 15)
            worksheet.set_column(6, 6, 6)
            worksheet.set_column(7, 8, 12)
            logo_url = f'https://{Config.S3_BUCKET}.s3.amazonaws.com/static/logo.png'
            image_data = BytesIO(urlopen(logo_url).read())
            worksheet.insert_image(2, 6, logo_url, {'image_data': image_data, 'x_scale': 0.5, 'y_scale': 0.5})
            # worksheet.insert_image(2, 6, 'api/static/logo.png', {'x_scale': 0.5, 'y_scale': 0.5})
            worksheet.merge_range(2, 1, 2, 3, 'My Charity Change', merge_format)
            worksheet.merge_range(3, 1, 3, 3, 'ABN: 58637688898', merge_format)
            worksheet.merge_range(4, 1, 4, 3, 'P O Box 9545, Melbourne, VIC 3004', merge_format)
            worksheet.merge_range(5, 1, 5, 3, '1300 584 001', merge_format)
            worksheet.merge_range(6, 1, 6, 3, 'Admin@mycharitychange.com.au', merge_format)

            worksheet.merge_range(8, 1, 8, 2, '', merge_format)
            worksheet.write_datetime(8, 1, sheet_name, date_format)
            worksheet.merge_range(9, 1, 9, 2, 'Tax invoice & Receipt', merge_format_bold_title)
            worksheet.merge_range(10, 1, 10, 2, '', merge_format_bottom)
            worksheet.merge_range(11, 1, 11, 2, 'Donor Details', merge_format_bold)
            worksheet.merge_range(12, 1, 12, 2, f"{customer.first_name} {customer.last_name}", merge_format)
            worksheet.merge_range(13, 1, 13, 2, f"{customer.email}", merge_format)
            worksheet.merge_range(15, 1, 15, 8, '', merge_format_top)
            worksheet.merge_range(16, 1, 16, 2, 'Donation Details', merge_format_bold_title)
            worksheet.write(17, 7, 'This week', merge_format_bold_center)
            worksheet.write(17, 8, 'YTD', merge_format_bold_center)
            worksheet.merge_range(18, 1, 18, 3, 'Organisation', merge_format_bold)
            worksheet.write(18, 4, 'ABN', merge_format_bold)
            worksheet.write(18, 5, 'Receipt number', merge_format_bold)
            worksheet.write(18, 7, 'Amount', merge_format_bold_center)
            worksheet.write(18, 8, 'Amount', merge_format_bold_center)
            last_row = 19

        if donation.charity.id in charity_by_year:
            charity_by_year[donation.charity.id]['donat_amount'] += donation.donat_amount
        else:
            charity_by_year[donation.charity.id] = {
                'name': donation.charity.name,
                'donat_amount': donation.donat_amount
            }
        total_week += donation.donat_amount
        total_year += donation.donat_amount
        charity_by_week.append(donation.charity.id)

        for j in range(MAX_COLUMN):
            worksheet.write(last_row, j, '', merge_format)
        worksheet.merge_range(last_row, 1, last_row, 3, donation.charity.name, merge_format)
        worksheet.write(last_row, 4, donation.charity.abn, merge_format)
        worksheet.write(last_row, 5, f"#MCC{1000000 + donation.id}", merge_format)
        worksheet.write(last_row, 7, f"$ {round(donation.donat_amount, 2)}", merge_format_right)
        worksheet.write(
            last_row, 8, f"$ {round(charity_by_year[donation.charity.id]['donat_amount'], 2)}", merge_format_right)
        last_row += 1

    if worksheet:
        sheet_bottom(worksheet, charity_by_year, charity_by_week, last_row, total_week,
                     total_year, merge_format, merge_format_top, merge_format_right, merge_format_top_right)
        worksheet.activate()

    workbook.close()
    output.seek(0)
    file_date = sheet_name if sheet_name else datetime.now()
    return output, f"MCC_tax reciept_{file_date.strftime('%d-%m-%Y')}.xlsx"


# def generate_customer_tax_receipt(customer):
#     output = BytesIO()
#     workbook = xlsxwriter.Workbook(output, {'in_memory': True})
#     worksheet = workbook.add_worksheet()
#     merge_format = workbook.add_format({
#         'align': 'left',
#         'bg_color': 'white',
#         'font_name': 'Roboto'
#     })
#     merge_format_top = workbook.add_format({
#         'align': 'left',
#         'bg_color': 'white',
#         'font_name': 'Roboto',
#         'top': 2,
#         'font_size': 9,
#     })
#     merge_format_bottom = workbook.add_format({
#         'align': 'left',
#         'bg_color': 'white',
#         'bottom': True,
#     })
#     merge_format_bold = workbook.add_format({
#         'align': 'left',
#         'bg_color': 'white',
#         'bold': True,
#         'font_name': 'Roboto',
#     })
#     merge_format_bold_title = workbook.add_format({
#         'align': 'left',
#         'bg_color': 'white',
#         'bold': True,
#         'font_size': 14,
#         'font_name': 'Roboto',
#     })
#     merge_format_total = workbook.add_format({
#         'align': 'left',
#         'bg_color': 'white',
#         'bold': True,
#         'font_size': 18,
#         'font_name': 'Roboto',
#     })
#     date_format = workbook.add_format({
#         'num_format': 'd mmmm yyyy',
#         'align': 'left',
#         'bg_color': 'white',
#         'color': 'gray',
#         'font_name': 'Roboto',
#     })
#     for i in range(19):
#         for j in range(9):
#             worksheet.write(i, j, '', merge_format)
#     worksheet.set_column(1, 7, 15)
#     logo_url = f'https://{Config.S3_BUCKET}.s3.amazonaws.com/static/logo.png'
#     image_data = BytesIO(urlopen(logo_url).read())
#     worksheet.insert_image(2, 6, logo_url, {'image_data': image_data, 'x_scale': 0.5, 'y_scale': 0.5})
#     # worksheet.insert_image(2, 6, 'api/static/logo.png', {'x_scale': 0.5, 'y_scale': 0.5})
#     worksheet.merge_range(2, 1, 2, 3, 'My Charity Change', merge_format)
#     worksheet.merge_range(3, 1, 3, 3, 'ABN: 58637688898', merge_format)
#     worksheet.merge_range(4, 1, 4, 3, 'P O Box 9545, Melbourne, VIC 3004', merge_format)
#     worksheet.merge_range(5, 1, 5, 3, '1300 584 001', merge_format)
#     worksheet.merge_range(6, 1, 6, 3, 'Admin@mycharitychange.com.au', merge_format)

#     worksheet.merge_range(8, 1, 8, 2, '', merge_format)
#     worksheet.write_datetime(8, 1, datetime.now().date(), date_format)
#     worksheet.merge_range(9, 1, 9, 2, 'Tax invoice & Receipt', merge_format_bold_title)
#     worksheet.merge_range(10, 1, 10, 2, '', merge_format_bottom)
#     worksheet.merge_range(11, 1, 11, 2, 'Donor Details', merge_format_bold)
#     worksheet.merge_range(12, 1, 12, 2, f"{customer.first_name} {customer.last_name}", merge_format)
#     worksheet.merge_range(13, 1, 13, 2, f"{customer.email}", merge_format)
#     worksheet.merge_range(15, 1, 15, 7, '', merge_format_top)
#     worksheet.merge_range(16, 1, 16, 2, 'Donation Details', merge_format_bold_title)
#     last_row = 18
#     # weekly table
#     worksheet.merge_range(last_row, 1, last_row, 3, 'Organisation', merge_format_bold)
#     worksheet.write(last_row, 4, 'ABN', merge_format_bold)
#     worksheet.merge_range(last_row, 5, last_row, 6, 'Receipt number', merge_format_bold)
#     worksheet.write(last_row, 7, 'Amount', merge_format_bold)
#     last_row += 1
#     weekly_charities = []
#     # for weekly_donations
#     # for charity in customer.charities:
#     #     if charity.is_active:
#     #         weekly_charities.append({
#     #             'charity': charity.charity,
#     #             'donat': models.WeeklyDonation.query.filter(
#     #                 models.WeeklyDonation.charity_id == charity.charity_id).order_by(
#     #                     models.WeeklyDonation.id.desc()).first()
#     #         })
#     # for item in weekly_charities:
#     #     for j in range(9):
#     #         worksheet.write(last_row, j, '', merge_format)
#     #     worksheet.merge_range(last_row, 1, last_row, 3, item['charity'].name, merge_format)
#     #     worksheet.write(last_row, 4, item['charity'].abn, merge_format)
#     #     try:
#     #         receipt_number = f"#MCC{1000000 + item['donat'].id}"
#     #     except AttributeError:
#     #         receipt_number = ''
#     #     weekly_amount = f"{get_weekly_donations_by_id(customer, item['donat'])} $"
#     #     if weekly_amount == '0.0 $':
#     #         receipt_number = ''
#     #     worksheet.merge_range(last_row, 5, last_row, 6, receipt_number, merge_format)
#     #     worksheet.write(last_row, 7, weekly_amount, merge_format)
#     #     last_row += 1

#     # for transfer_donatons
#     donations = models.TransferDonation.query.filter(
#         models.TransferDonation.customer_id == customer.id,
#         models.TransferDonation.status == models.TransferStatus.NEW
#     )
#     for donat in donations:
#         for j in range(9):
#             worksheet.write(last_row, j, '', merge_format)
#         worksheet.merge_range(last_row, 1, last_row, 3, donat.charity.name, merge_format)
#         worksheet.write(last_row, 4, donat.charity.abn, merge_format)
#         worksheet.merge_range(last_row, 5, last_row, 6, f"#MCC{1000000 + donat.id}", merge_format)
#         worksheet.write(last_row, 7, donat.donat_amount, merge_format)
#         last_row += 1

#     for i in range(3):
#         for j in range(9):
#             worksheet.write(last_row + i, j, '', merge_format)
#     worksheet.merge_range(last_row + 1, 1, last_row + 1, 7, '', merge_format_top)
#     last_row += 2

#     # all history table
#     charities = {}
#     # for weekly_donations
#     donations = models.TransactionDonation.query.filter(
#         models.TransactionDonation.customer_id == customer.id,
#         models.TransactionDonation.weekly_donation_id != None
#     )
#     for donat in donations:
#         charity = donat.weekly_donation.charity
#         if charity.id not in charities:
#             charities[charity.id] = {'name': charity.name, 'abn': charity.abn, 'amount': 0.0}
#         charities[charity.id]['amount'] += donat.donat_amount
#     # for transfer_donations
#     donations = models.TransferDonation.query.filter(
#         models.TransferDonation.customer_id == customer.id
#     )
#     for donat in donations:
#         charity = donat.charity
#         if charity.id not in charities:
#             charities[charity.id] = {'name': charity.name, 'abn': charity.abn, 'amount': 0.0}
#         charities[charity.id]['amount'] += donat.donat_amount

#     worksheet.write(last_row, 1, 'Qty', merge_format_bold)
#     worksheet.merge_range(last_row, 2, last_row, 4, 'Organisation', merge_format_bold)
#     # worksheet.write(last_row, 3, 'ABN.', merge_format_bold)
#     worksheet.write(last_row, 7, 'Sub Total', merge_format_bold)
#     last_row += 1
#     total_donat_amount = 0.0
#     for index, (charity_id, charity) in enumerate(charities.items(), 1):
#         for j in range(9):
#             worksheet.write(last_row, j, '', merge_format)
#         worksheet.write(last_row, 1, index, merge_format)
#         worksheet.merge_range(last_row, 2, last_row, 4, charity['name'], merge_format)
#         # worksheet.write(last_row, 3, charity['abn'], merge_format)
#         worksheet.write(last_row, 7, f"{charity['amount']} $", merge_format)
#         total_donat_amount += charity['amount']
#         last_row += 1
#     for i in range(7):
#         for j in range(9):
#             worksheet.write(last_row + i, j, '', merge_format)
#     last_row += 1
#     worksheet.merge_range(last_row, 5, last_row, 6, 'Payment method', merge_format_bold)
#     worksheet.write(last_row, 7, 'Credit Card', merge_format)
#     last_row += 1
#     worksheet.merge_range(last_row, 5, last_row, 6, 'Total', merge_format_total)
#     worksheet.write(last_row, 7, f"{round(total_donat_amount, 2)} $", merge_format)
#     last_row += 2
#     worksheet.merge_range(last_row, 1, last_row, 7,
#                           "Thank you for supporting Australian charities and not for profit organisations. The impact you've made really does create Change for Change.",
#                           merge_format_top)

#     workbook.close()
#     output.seek(0)
#     return output


def generate_weekly_report():
    print('generate_weekly_report')
    transfer = models.TransferDonation.query.filter_by(status="NEW").first()
    if transfer:
        date = transfer.created_at + timedelta(days=1)
    else:
        date = datetime.now()
    print(f"generate_weekly_report: {date.strftime('%d-%m-%Y')}")
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    format_bold_center = workbook.add_format({
        'align': 'center', 'bg_color': 'yellow', 'bold': True, 'font_name': 'Roboto',
    })
    format_center = workbook.add_format({
        'align': 'center', 'font_name': 'Roboto',
    })
    worksheet = workbook.add_worksheet()
    worksheet.set_column(0, 6, 15)
    worksheet.set_column(1, 1, 40)
    worksheet.merge_range(0, 0, 1, 0, 'Date', format_bold_center)
    worksheet.merge_range(0, 1, 1, 1, 'Organisation name', format_bold_center)
    worksheet.merge_range(0, 2, 1, 2, 'ABN', format_bold_center)
    worksheet.merge_range(0, 3, 0, 4, 'Weekly', format_bold_center)
    worksheet.merge_range(0, 5, 0, 6, 'YTD', format_bold_center)
    worksheet.write(1, 3, 'Transactions', format_bold_center)
    worksheet.write(1, 4, 'Amount', format_bold_center)
    worksheet.write(1, 5, 'Transactions', format_bold_center)
    worksheet.write(1, 6, 'Amount', format_bold_center)

    for row, charity in enumerate(models.Charity.query.all(), 2):
        weekly_sum = models.db.session.query(
            func.count(models.TransferDonation.id).label('count'),
            func.sum(models.TransferDonation.donat_amount).label('sum')
        ).filter(models.TransferDonation.charity == charity, models.TransferDonation.status == 'NEW').first()
        year_sum = models.db.session.query(
            func.count(models.TransferDonation.id).label('count'),
            func.sum(models.TransferDonation.donat_amount).label('sum')
        ).filter(models.TransferDonation.charity == charity).first()
        worksheet.write(row, 0, date.strftime('%d-%b'), format_center)
        worksheet.write(row, 1, charity.name, format_center)
        worksheet.write(row, 2, charity.abn, format_center)
        worksheet.write(row, 3, weekly_sum[0], format_center)
        if weekly_sum[1] is None:
            worksheet.write(row, 4, "$ 0", format_center)
        else:
            worksheet.write(row, 4, f"$ {round(weekly_sum[1], 2)}", format_center)
        worksheet.write(row, 5, year_sum[0], format_center)
        if year_sum[1] is None:
            worksheet.write(row, 6, "$ 0", format_center)
        else:
            worksheet.write(row, 6, f"$ {round(year_sum[1], 2)}", format_center)

    workbook.close()
    output.seek(0)
    return output, f"MCC_weekly_report_{date.strftime('%d-%m-%Y')}.xlsx"
