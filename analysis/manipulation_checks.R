library(ggplot2)

source("~/research/polarization/outsider/analysis/clean_data.R")
setwd("~/research/polarization/outsider/")
results_dir = './results/'

#data_dir = './data/2019-11-16/'
data_dir = './data/2020-01-15/'
party_players <- clean_democratic_republican_data(data_dir)

# this variable determies which party data we want to look at
#party <- 'republican'
party <- 'democratic'
players <- party_players[[paste0(party, "_players")]]
#players <- players[players$data.senate == "republicans",]
table(players$data.other_player_party, useNA="ifany")

players <- players[players$num_responses > 2,]
# limit to those who spent at least 10 seconds in first round and 5 seconds in second round
#players <- players[players$DurationStage0 > 10,]
#players <- players[players$DurationStage1 > 5,]

players <- add_aux_variables(players)
#players <- players[!is.na(players$correct_other_player_party) & players$correct_other_player_party,]
players <- droplevels(players)

data <- players[,c("data.article",
                   "data.american_feel", "data.democrats_feel", "data.republicans_feel",
                   "data.chinese_feel", "data.iranians_feel", "data.russians_feel")]
colnames(data) <- c("Article", "Americans", "Democrats", "Republicans", "Chinese", "Iranians", "Russians")
data <- melt(as.data.frame(data), id="Article")
data$Article <- as.character(data$Article)
data$Article[data$Article == 'Hashtag_Rock.png'] <- 'Control'
data$Article[data$Article == 'HotDog.png'] <- 'Patriotic'
data$Article[data$Article == 'SuperEnemy.png'] <- 'Enemy'
data$Article <- factor(data$Article, levels=c('Control', 'Patriotic', 'Enemy'), ordered = TRUE)

p <- ggplot(data, aes(x=variable, y=value, fill=factor(Article))) + 
  stat_summary(fun.y=mean, geom="bar",position=position_dodge(1)) + 
  stat_summary(fun.data=mean_se, geom="errorbar", color="grey40",position=position_dodge(1), width=.2) +
  scale_fill_discrete("Priming Article") +
  xlab('Group') + ylab('Feeling Toward')
p
ggsave(paste0(results_dir, party, "_manipulation_check.pdf"), width=8, height=4, units="in")
