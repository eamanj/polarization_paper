library(ggplot2)
library(gridExtra)

source("~/research/polarization/outsider/analysis/clean_data.R")
setwd("~/research/polarization/outsider/")
results_dir = './results/'

#data_dir = './data/2019-11-16/'
data_dir = './data/2020-01-15/'
party_players <- clean_democratic_republican_data(data_dir)

# this variable determies which party data we want to look at
party <- 'republican'
#party <- 'democratic'
players <- party_players[[paste0(party, "_players")]]
players <- players[!players$missing_response0 & !players$missing_response1,]
players <- add_aux_variables(players)

#players <- players[!is.na(players$data.senate) & players$data.senate == "republicans",]
table(players$data.senate, useNA="ifany")
#players <- players[!is.na(players$correct_other_player_party) & players$correct_other_player_party,]
table(players$data.other_player_party, useNA="ifany")
players <- droplevels(players)

# limit to those who spent at least 10 seconds in first round and 3 seconds in second round
#players <- players[players$DurationStage0 > 10,]
#players <- players[players$DurationStage1 > 3,]

# limit only to those who update toward bot
#players <- players[players$corrected_update > 0,]

control_players <- players[players$data.article == "Hashtag_Rock.png",]
patriotic_players <- players[players$data.article == "HotDog.png",]
enemey_players <- players[players$data.article == "SuperEnemy.png",]

ggplot(players, aes(data.response0, data.response1)) +
  geom_abline(intercept=0, slope=1) +
  geom_vline(xintercept=50, color='red') +
  geom_point() +
  geom_smooth(span=2)

ggplot(players, aes(data.response0, update)) +
  geom_point() +
  geom_vline(xintercept=50, color='red') +
  geom_hline(yintercept=0, color='red') +
  geom_smooth(span=2)

ggplot(players, aes(data.response0, corrected_update)) +
  geom_point() +
  geom_vline(xintercept=50, color='red') +
  geom_hline(yintercept=0, color='red') +
  geom_smooth(span=2)

ggplot(players, aes(distance_to_50, corrected_update)) +
  geom_point() +
  geom_smooth(span=2)

ggplot(players, aes(as.factor(sign_response0_diff), update, fill = sign_response0_diff)) +
  theme_bw() + theme(legend.position = "none") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)

ggplot(players, aes(as.factor(sign_response0_diff), corrected_update, fill = sign_response0_diff)) +
  theme_bw() + theme(legend.position = "none") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)

ggplot(players, aes(data.article, update, fill = data.article)) +
  theme_bw() + theme(legend.position = "none") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)

p <- ggplot(players, aes(data.article, corrected_update, fill = data.article)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se) + 
  #ggtitle(paste('Updates of', party, 'party')) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_corrected_updates.pdf'), p,  width = 6.5, height = 4, units = 'in')

p <- ggplot(players, aes(data.article, corrected_update, fill = after_assassination)) +
  theme_bw() +
  labs(fill='After\nAssassination') +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_se, position=position_dodge(preserve="single")) +
  #ggtitle(paste('Updates before/after assassination')) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_corrected_updates_assassination.pdf'), p,  width = 7, height = 4, units = 'in')

# analysis by feeling toward either party
top_feeling_pct <- 10
republican_var = paste0('top', top_feeling_pct, 'pct_republican_feel')
democratic_var = paste0('top', top_feeling_pct, 'pct_democratic_feel')
p <- ggplot(players[!is.na(players[,republican_var]),], aes_string(republican_var, 'corrected_update')) +
  theme_bw() +
  labs(fill=paste('Top', top_feeling_pct, '%\nRepublican Feeling')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) + 
  xlab('Priming Article') + ylab('Corrected Update')
p

p <- ggplot(players[!is.na(players[,democratic_var]),], aes_string(democratic_var, 'corrected_update')) +
  theme_bw() +
  labs(fill=paste('Top', top_feeling_pct, '%\nRepublican Feeling')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) + 
  xlab('Priming Article') + ylab('Corrected Update')
p

players$top10pct_republican_feel <- (players$data.republicans_feel > 98)
p <- ggplot(players[!is.na(players[,republican_var]),], aes_string('data.article', 'corrected_update', fill = republican_var)) +
  theme_bw() +
  labs(fill=paste('Top', top_feeling_pct, '%\nRepublican Feeling')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) + 
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_corrected_updates_by_republican_feeling.pdf'), p,  width = 7, height = 4, units = 'in')

p <- ggplot(players[!is.na(players[,democratic_var]),], aes_string('data.article', 'corrected_update', fill = democratic_var)) +
  theme_bw() +
  labs(fill=paste('Top', top_feeling_pct, '%\nDemocratic Feeling')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_corrected_updates_by_democratic_feeling.pdf'), p,  width = 7, height = 4, units = 'in')

p <- ggplot(players[!is.na(players$data.democrats),], aes_string('data.democrats', 'corrected_update', fill='data.democrats')) +
  theme_bw() +
  labs(fill=paste('Identify with\nDemocrats')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) +
  xlab('Identify with Democrats') + ylab('Corrected Update')
p

p <- ggplot(players[!is.na(players$data.republicans),], aes_string('data.republicans', 'corrected_update', fill='data.republicans')) +
  theme_bw() +
  labs(fill=paste('Identify with\nRepublicans')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) +
  xlab('Identify with Republicans') + ylab('Corrected Update')
p

# analysis by affective polarization
top_affective_polarization <- 10
polarization_var = paste0('top', top_affective_polarization, 'pct_affective_polarization')
p <- ggplot(players[!is.na(players[,polarizaion_var]),], aes_string(polarization_var, 'corrected_update')) +
  theme_bw() +
  labs(fill=paste('Top', top_affective_polarization, '%\nAffective Polarization')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) + 
  xlab('Priming Article') + ylab('Corrected Update')
p

p <- ggplot(players[!is.na(players[,polarization_var]),], aes_string('data.article', 'corrected_update', fill = polarization_var)) +
  theme_bw() +
  labs(fill=paste('Top', top_affective_polarization, '%\nAffective Polarization')) +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_cl_normal, position=position_dodge(preserve="single")) + 
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_corrected_updates_by_top_', top_affective_polarization,
              'pct_affective_polarization.pdf'), p,  width = 7, height = 4, units = 'in')

ggplot(players, aes(data.article, data.response0, fill = data.article)) +
  theme_bw() + theme(legend.position = "none") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)
ggplot(players, aes(data.article, data.response1, fill = data.article)) +
  theme_bw() + theme(legend.position = "none") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)
ggplot(players, aes(response0_bin, corrected_update, fill = response0_bin_prop)) +
  theme_bw() +
  labs(fill='Fraction of Bin') +
  scale_fill_gradient(high="#132B43", low="#56B1F7") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)

# perceived knowledge of the other player vs level of update
ggplot(players, aes(data.short_knowledge, corrected_update, fill = data.short_knowledge)) +
  theme_bw() +
  labs(fill='Knowledge of other player') +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_se, position=position_dodge(preserve="single"))
# perceived knowledge of the other player vs the initial guess which determines the bot guess
ggplot(players, aes(x=data.short_knowledge, group=response0_bin)) +
  geom_bar(aes(y = ..prop.., fill = response0_bin), position='dodge', stat='count') + 
  theme_bw() +
  ylab("Fraction within initial guess group") +
  xlab("Knowledge of other player") +
  labs(fill="Initial guess bin")

ggplot(players, aes(response0_bin, corrected_update, fill = data.article)) +
  theme_bw() +
  labs(fill='Treatment') +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_se, position=position_dodge(preserve="single"))
ggplot(players, aes(response0_bin2, corrected_update, fill = data.article)) +
  theme_bw() +
  labs(fill='Treatment') +
  stat_summary(geom = "bar", fun.y = mean, position=position_dodge(preserve="single")) +
  stat_summary(geom = "errorbar", fun.data = mean_se, position=position_dodge(preserve="single"))

p1 <- ggplot(control_players, aes(response0_bin, corrected_update, fill = response0_bin_prop)) +
  theme_bw() + ggtitle("Control Players") +
  coord_cartesian(ylim=c(0, 25)) +
  labs(fill='Fraction of Bin') +
  scale_fill_gradient(high="#132B43", low="#56B1F7") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)
p2 <- ggplot(patriotic_players, aes(response0_bin, corrected_update, fill = response0_bin_prop)) +
  theme_bw() + ggtitle("Patriotic Players") +
  coord_cartesian(ylim=c(0, 25)) +
  labs(fill='Fraction of Bin') +
  scale_fill_gradient(high="#132B43", low="#56B1F7") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)
p3 <- ggplot(enemey_players, aes(response0_bin, corrected_update, fill = response0_bin_prop)) +
  theme_bw() + ggtitle("Enemy Players") +
  coord_cartesian(ylim=c(0, 25)) +
  labs(fill='Fraction of Bin') +
  scale_fill_gradient(high="#132B43", low="#56B1F7") +
  stat_summary(geom = "bar", fun.y = mean) +
  stat_summary(geom = "errorbar", fun.data = mean_se)
p <- grid.arrange(p1, p2, p3, ncol=3)

ggplot(players, aes(x=corrected_update, fill=data.article)) +
  geom_histogram(aes(y=c(..count..[..group..==1]/sum(..count..[..group..==1]),
                         ..count..[..group..==2]/sum(..count..[..group..==2]),
                         ..count..[..group..==3]/sum(..count..[..group..==3]))),
                 position=position_dodge(width=9), binwidth=10) +
  ylab("Within treatment fraction")

# Feeling toward republicans
ggplot(players, aes(x=data.republicans_feel)) +
  geom_histogram(aes(y=..count../sum(..count..)), binwidth=10, color='black', fill='gray') +
  ylab("Fraction")
ggplot(players, aes(x=data.republicans_feel, fill=data.article)) +
  geom_histogram(aes(y=c(..count..[..group..==1]/sum(..count..[..group..==1]),
                         ..count..[..group..==2]/sum(..count..[..group..==2]),
                         ..count..[..group..==3]/sum(..count..[..group..==3]))),
                 position=position_dodge(width=9), binwidth=10) +
  ylab("Within treatment fraction")
ggplot(players, aes(x=data.republicans)) +
  geom_bar(aes(y=..count../sum(..count..))) +
  ylab("Fraction")
ggplot(players, aes(data.republicans, group=data.article)) +
  geom_bar(aes(y = ..prop.., fill = data.article), position='dodge', stat='count') + 
  ylab("Within treatment fraction")

# democrat feel
ggplot(players, aes(x=data.democrats_feel)) +
  geom_histogram(aes(y=..count../sum(..count..)), binwidth=10, color='black', fill='gray') +
  ylab("Fraction")
ggplot(players, aes(x=data.democrats_feel, fill=data.article)) +
  geom_histogram(aes(y=c(..count..[..group..==1]/sum(..count..[..group..==1]),
                         ..count..[..group..==2]/sum(..count..[..group..==2]),
                         ..count..[..group..==3]/sum(..count..[..group..==3]))),
                 position=position_dodge(width=9), binwidth=10) +
  ylab("Within treatment fraction")
ggplot(players, aes(x=data.democrats)) +
  geom_bar(aes(y=..count../sum(..count..))) +
  ylab("Fraction")
ggplot(players, aes(data.democrats, group=data.article)) +
  geom_bar(aes(y = ..prop.., fill = data.article), position='dodge', stat='count') + 
  ylab("Within treatment fraction")

summary(lm(data.response0 ~ data.article, players))
summary(lm(data.response0 ~ top10pct_democratic_feel, players))
summary(lm(data.response0 ~ top10pct_republican_feel, players))
summary(lm(data.response1 ~ data.article, players))
summary(lm(data.response1 ~ data.response0 + data.article*sign_response0_diff, players))
summary(lm(data.response1 ~ data.response0 + data.article*sign_response0_diff + data.knowledge*sign_response0_diff, players))
summary(lm(data.response1 ~ data.response0 + data.article*sign_response0_diff, players))
summary(lm(data.response1 ~ data.response0 + distance_to_50 + data.article*sign_response0_diff, players))
summary(lm(corrected_update ~ data.article, players))
summary(lm(corrected_update ~ data.article*top10pct_democratic_feel, players))
summary(lm(corrected_update ~ data.article*top10pct_republican_feel, players))
summary(lm(corrected_update ~ distance_to_50 + data.article, players))
summary(lm(corrected_update ~ distance_to_50 + data.article + data.knowledge, players))
summary(lm(corrected_update ~ response0_bin + data.article + data.knowledge, players))
summary(lm(corrected_update ~ data.article + data.knowledge, players))

# after assassination analysis at party level without primes
lmfit <- lm(corrected_update ~ after_assassination + data.gender, players)
lmfit <- lm(corrected_update ~ after_assassination*data.senate + data.gender + correct_other_player_party, players)
lmfit <- lm(corrected_update ~ after_assassination*data.senate + data.gender + correct_other_player_party + response0_bin_unordered, players)
lmfit <- lm(corrected_update ~ after_assassination+data.senate + data.gender + correct_other_player_party + response0_bin_unordered, players)

summary(lmfit)
nobs(lmfit)