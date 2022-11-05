import pandas as pd
import argparse


parser = argparse.ArgumentParser(
    description='This script removes the sensitive fields from the data')
parser.add_argument("players_input",
                    help="The location of players.csv")
parser.add_argument("players_output",
                    help="The location of output file without the sensitive fields")
args = parser.parse_args()


if __name__ == '__main__':
    data = pd.read_csv(args.players_input)
    data = data.drop(['id', 'urlParams'], axis=1)
    data.to_csv(args.players_output, index=False)
