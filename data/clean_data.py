'''
Author: Yaseen Lotfi
Date: 2/9/2016
Program: Query and prepare toronto city data for D3 visualizations
    - Convert timestamps
    - Count parking tickets by the day of the week
'''

# Import Dependencies
import pandas as pd
import datetime as dt


def weekdays(df, col_name, date_format='%Y%m%d'):
    ''' Pull weekday from timestamp '''
    format_date = dt.datetime.strptime(str(df[col_name]), date_format)
    return format_date


def tickets_by_day(data):
    pass


def main():
    df = pd.read_csv('data/Parking_Tags_Data_2012.csv')
    col_name = 'date_of_infraction'

    print(df.dtypes)


if __name__ == '__main__':
    main()