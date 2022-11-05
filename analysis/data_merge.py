#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed May  1 18:34:55 2019

@author: yleng
"""

#%%

import pandas as pd
import os 
os.chdir('/Users/yleng/Dropbox (MIT)/PhD/2019_Spring/polarization/soft_launch/soft-launch-V2')

def max_mag_update(predictions):
    '''
        compute the maximum update across rounds 
    '''
    predictions = [float(i) for i in predictions.split(',')]
    if len(predictions) == 1:
        return None
    elif len(predictions) == 2:
        return predictions[1] - predictions[0]
    else:
        max_update = predictions[1] - predictions[0]
        for i in range(2, len(predictions)):
            if abs(predictions[i] - predictions[i-1]) > abs(max_update):
                max_update = predictions[i] - predictions[i-1]
        return max_update
    
def ResponseToNum(x):
    '''
        maps the text responses to the numerical values
    '''
    if x.isdigit():
        return x 
    mapping = {'strong_agree': 5, 'agree':4, 'no_agree_disagree':3, 'disagree':2, 'strong_disagree':1, \
               'little':2, 'moderate':3, 'quite_bit':4, 'not_at_all':1, 'extreme':5}
    return mapping[x]
    

def merge_data(political_affiliation, version):
    '''
        input: string: republicans or democrats
                version \in 1, 2, indexes the first or second launch
        output: dataframe: player responses and the assigned treatment 
    '''
    
    # read in all the relevant files 
    if version == 2:
        stages = pd.read_csv('./' + political_affiliation + '/stages.csv').rename(columns = {'_id': 'stageId'})
        treatments = pd.read_csv('./' + political_affiliation + '/treatments.csv').rename(columns = {'_id': 'treatmentId'})
        games = pd.read_csv('./' + political_affiliation + '/games.csv').rename(columns = {'_id': 'gameId'})
        player_stages = pd.read_csv('./' + political_affiliation +'/player-stages.csv')
        players = pd.read_csv('./' + political_affiliation + '/players.csv')    
        players = players[players.createdAt >= '2019-04-27']
        # merge the information related to the treatment assigned to different games #
        treatmentMatched = pd.merge(stages, games, on = 'gameId', suffixes=('_stages', '_games'))
        treatmentMatched = pd.merge(treatmentMatched, treatments, on=['treatmentId'], suffixes=('', '_treatments'))
        treatmentMatched['bots_type'] = [i.split(' ')[2] for i in treatmentMatched['name_treatments'].values]
        treatmentMatched['priming'] = [i.split(' ')[1] for i in treatmentMatched['name_treatments'].values]
        treatmentMatched = pd.merge(player_stages, treatmentMatched, on = ['stageId'])[['name_treatments', 'playerId', 'bots_type', 'priming']]
        
        # merge the responses for bots and players matched in the same game # 
        botsReponses=players[players['bot'] == 'Bob'][['_id', 'data.responses','data.response0', 'data.response1', \
                    'data.response2', 'data.response3', 'data.response4']]
        playerResponses = players[players['bot'].isnull()]
        responseMerged = playerResponses.merge(botsReponses, how = 'left', left_on = ['data.neighbor_ids'], right_on = ['_id'], suffixes=('', '_bots'))
        responseMerged = responseMerged.merge(treatmentMatched, left_on = ['_id'], right_on = ['playerId'], how = 'left').drop_duplicates()
        responseMerged.drop(['urlParams', 'bot', 'retiredAt'], axis = 1, inplace = True)
        responseMerged = responseMerged[(responseMerged.exitStatus == 'finished') & (~responseMerged['data.political_affiliation'].isin(['independent']))]

        # map the exit survey reponses to numerical values # 
        for col in [u'data.state', u'data.neighborhood',  u'data.democrats', u'data.american', \
           u'data.republicans', u'data.attentive', u'data.alert',u'data.determined', u'data.active', u'data.inspired',\
           u'data.nervous', u'data.afraid',  u'data.upset', u'data.ashamed', u'data.hostile']:
            responseMerged[col] = [ResponseToNum(c) for c in responseMerged[col].values]

    elif version == 1:
        responseMerged = pd.read_csv('/Users/yleng/Dropbox (MIT)/PhD/2019_Spring/polarization/soft_launch/soft-launch 2.csv').rename(columns = {'bot.responses':'data.responses_bots'})
        responseMerged['data.response0'] = [float(i.split(',')[0]) for i in responseMerged['data.responses']]
        responseMerged['data.response1'] = [float(i.split(',')[1]) if len(i.split(',')) >=3 else None for i in responseMerged['data.responses']]
        responseMerged['data.response2'] = [float(i.split(',')[2]) if len(i.split(',')) >=4 else None for i in responseMerged['data.responses']]
        responseMerged['data.response3'] = [float(i.split(',')[3]) if len(i.split(',')) >=5 else None for i in responseMerged['data.responses']]
        responseMerged['data.response4'] = [float(i.split(',')[-1]) for i in responseMerged['data.responses']]
        
        responseMerged['bots_type'] = [i.split(' ')[2] for i in responseMerged.name.values]
        responseMerged['priming'] = [i.split(' ')[1] for i in responseMerged.name.values]
        
        responseMerged['data.response0_bots'] = [float(i.split(',')[0]) for i in responseMerged['data.responses_bots']]
        responseMerged['data.response1_bots'] = [float(i.split(',')[1]) for i in responseMerged['data.responses_bots']]
        responseMerged['data.response2_bots'] = [float(i.split(',')[2]) for i in responseMerged['data.responses_bots']]
        responseMerged['data.response3_bots'] = [float(i.split(',')[3]) for i in responseMerged['data.responses_bots']]
        responseMerged['data.response4_bots'] = [float(i.split(',')[4]) for i in responseMerged['data.responses_bots']]

        
    # add new fields for analysis # 
    responseMerged['priming+bots'] = responseMerged['priming'] + responseMerged['bots_type']
    responseMerged['priming+partisan'] = responseMerged['priming'] + responseMerged['bots_type']

    responseMerged['first_update'] = abs(responseMerged['data.response1'].values - responseMerged['data.response0'].values)
    responseMerged['second_update'] = abs(responseMerged['data.response2'].values - responseMerged['data.response1'].values)
    responseMerged['third_update'] = abs(responseMerged['data.response3'].values - responseMerged['data.response2'].values)
    responseMerged['fourth_update'] = abs(responseMerged['data.response4'].values - responseMerged['data.response3'].values)
    responseMerged['overall_update'] = abs(responseMerged['data.response4'].values - responseMerged['data.response0'].values)    
    responseMerged['max_update'] = [abs(max_mag_update(i)) for i in responseMerged['data.responses']]

    responseMerged['first_update_normalized'] = abs(responseMerged['data.response1'].values - responseMerged['data.response0'].values)/abs(responseMerged['data.response0'].values - responseMerged['data.response0_bots'].values)
    responseMerged['overall_update_normalized'] = abs(responseMerged['data.response4'].values - responseMerged['data.response0'].values)/abs(responseMerged['data.response0'].values - responseMerged['data.response0_bots'].values)

    second_update_normalized = []
    third_update_normalized = []
    fourth_update_normalized = []
    max_update_normalized = []
    for i in range(len(responseMerged)):
        if responseMerged['data.response4'].values[i]:       
            if responseMerged['data.response3'].values[i]:
                fourth_update_normalized.append(responseMerged['fourth_update'].values[i] / abs(responseMerged['data.response3'].values[i] - responseMerged['data.response3_bots'].values[i] ))
            if responseMerged['data.response3'].values[i]:
                if responseMerged['data.response2'].values[i]:
                    third_update_normalized.append(responseMerged['third_update'].values[i] / abs(responseMerged['data.response2'].values[i] - responseMerged['data.response2_bots'].values[i] ))
                    if not responseMerged['data.response3'].values[i]:
                        fourth_update_normalized.append(responseMerged['fourth_update'].values[i] / abs(responseMerged['data.response2'].values[i] - responseMerged['data.response2_bots'].values[i] ))
                if responseMerged['data.response2'].values[i]:
                    if responseMerged['data.response1'].values[i]:
                        second_update_normalized.append(responseMerged['second_update'].values[i] / abs(responseMerged['data.response1'].values[i] - responseMerged['data.response1_bots'].values[i] ))
                        if not responseMerged['data.response2'].values[i]:
                            third_update_normalized.append(responseMerged['third_update'].values[i] / abs(responseMerged['data.response1'].values[i] - responseMerged['data.response1_bots'].values[i] ))
                        if not responseMerged['data.response3'].values[i] and responseMerged['data.response2'].values[i]:
                            fourth_update_normalized.append(responseMerged['fourth_update'].values[i] / abs(responseMerged['data.response1'].values[i] - responseMerged['data.response1_bots'].values[i] ))                            
                    else:
                        second_update_normalized.append(responseMerged['second_update'].values[i] / abs(responseMerged['data.response0'].values[i] - responseMerged['data.response0_bots'].values[i] ))
                        if not responseMerged['data.response2'].values[i]:
                            third_update_normalized.append(responseMerged['third_update'].values[i] / abs(responseMerged['data.response0'].values[i] - responseMerged['data.response0_bots'].values[i] ))
                        if not responseMerged['data.response3'].values[i] and not responseMerged['data.response2'].values[i] and not responseMerged['data.response1'].values[i]:
                            fourth_update_normalized.append(responseMerged['fourth_update'].values[i] / abs(responseMerged['data.response20'].values[i] - responseMerged['data.response0_bots'].values[i] ))                       
                else:
                    second_update_normalized.append(None)
            else:
                third_update_normalized.append(None)
        else:
            fourth_update_normalized.append(None)
            
        max_update_normalized.append(max([second_update_normalized[i], third_update_normalized[i],fourth_update_normalized[i], responseMerged['first_update_normalized'].values[i]]))

    responseMerged['second_update_normalized'] = second_update_normalized
    responseMerged['third_update_normalized'] = third_update_normalized
    responseMerged['fourth_update_normalized'] = fourth_update_normalized
    responseMerged['max_update_normalized'] = max_update_normalized 

    print('There are ', len(responseMerged), political_affiliation, 'in soft-launch', version, 'who have finished the experiments')
    return responseMerged


republicans = merge_data('republicans', 2)
democrats = merge_data('democrats', 2)
firstLaunch = merge_data('both parties', 1)
### process the data in the first round of soft-launch. Can be deleted once the database is cleaned. 
data = pd.concat([republicans, democrats, firstLaunch], ignore_index=True)
data.to_csv('soft_launch_two_rounds.csv')