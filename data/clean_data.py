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
    return format_date.strftime('%A')


def ticket_count(df, col_name, date_format):
    df['weekday'] = df.apply(weekdays(df, col_name), axis=1)
    weekday_counts = df['weekday'].value_counts()
    return weekday_counts 


def main():
    df = pd.read_csv('data/Parking_Tags_Data_2012.csv')
    col_name = 'date_of_infraction'
    date_format = '%Y%m%d'
    weekday_counts = ticket_count(df, col_name, date_format)

    print(weekday_counts)


if __name__ == '__main__':
    main()