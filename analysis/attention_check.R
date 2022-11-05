library(ggplot2)

source("~/research/polarization/outsider/analysis/clean_data.R")
setwd("~/research/polarization/outsider/")

opposite_party <- function(party) {
  stopifnot(party %in% c('republican', 'democratic'))
  oppos_p <- 'republican'
  if(party == 'republican') {
    oppos_p <- 'democratic'
  }
  return(oppos_p)
}

data_dir = './data/2019-11-16/'
party_players <- clean_democratic_republican_data(data_dir)

# this variable determies which party data we want to look at
party <- 'republican'
party <- 'democratic'
players <- party_players[[paste0(party, "_players")]]
#players <- players[!is.na(players$data.other_player_party) & players$data.other_player_party == opposite_party(party),]
#players <- players[players$data.senate == "republicans",]

players <- players[!players$missing_response0,]
players <- players[!players$missing_response0 & !players$missing_response1,]
# limit to those who spent at least 10 seconds in first round and 5 seconds in second round

players <- add_aux_variables(players)
players$attentive1 <- players$DurationStage0 > 10
players$attentive2 <- players$DurationStage0 > 5
table(players$attentive1, useNA="ifany")
table(players$attentive2, useNA="ifany")

ggplot(players, aes(data.senate, data.response0)) +
  stat_summary(geom="errorbar", fun.data=mean_se)
ggplot(players, aes(data.other_player_party, data.response0)) +
  stat_summary(geom="errorbar", fun.data=mean_se)
ggplot(players, aes(attentive1, data.response0)) +
  stat_summary(geom="errorbar", fun.data=mean_se)
ggplot(players, aes(attentive2, data.response0)) +
  stat_summary(geom="errorbar", fun.data=mean_se)

ggplot(players, aes(data.senate, corrected_update)) +
  stat_summary(geom="errorbar", fun.data=mean_se)
ggplot(players, aes(data.other_player_party, corrected_update)) +
  stat_summary(geom="errorbar", fun.data=mean_se)
ggplot(players, aes(attentive1, corrected_update)) +
  stat_summary(geom="errorbar", fun.data=mean_se)
ggplot(players, aes(attentive2, corrected_update)) +
  stat_summary(geom="errorbar", fun.data=mean_se)