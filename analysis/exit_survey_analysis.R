library(ggplot2)
library(gridExtra)
library(tidyr)

source("~/research/polarization/outsider/analysis/clean_data.R")
setwd("~/research/polarization/outsider/")
results_dir = './results/'

#data_dir = './data/2019-11-16/'
data_dir = './data/2020-01-15/'
party_players <- clean_democratic_republican_data(data_dir)


# republican data
republican_players <- party_players[["republican_players"]]
republican_players <- republican_players[!republican_players$missing_response0 & !republican_players$missing_response1,]
# we are analyzing exit survey data, so we limit the analysis on those who answered the attention check
# during exit survey correctly
table(republican_players$data.senate, useNA="ifany")
republican_players <- republican_players[!is.na(republican_players$data.senate) & (republican_players$data.senate=="republicans"),]
republican_players <- add_aux_variables(republican_players)

#republican_players <- republican_players[!is.na(republican_players$correct_other_player_party) & republican_players$correct_other_player_party,]
table(republican_players$data.other_player_party, useNA="ifany")
republican_players <- droplevels(republican_players)

republican_players$other_player_party <- ifelse(republican_players$correct_other_player_party, "correct" , "incorrect")
republican_players$assassination <- ifelse(republican_players$after_assassination, "After", "Before")
republican_players$assassination <- factor(republican_players$assassination, levels=c("Before", "After"))
republican_players <- as.data.frame(republican_players)

# democratic data
democratic_players <- as.data.frame(party_players[["democratic_players"]])
democratic_players <- democratic_players[!democratic_players$missing_response0 & !democratic_players$missing_response1,]
# we are analyzing exit survey data, so we limit the analysis on those who answered the attention check
# during exit survey correctly
table(democratic_players$data.senate, useNA="ifany")
democratic_players <- democratic_players[!is.na(democratic_players$data.senate) & (democratic_players$data.senate=="republicans"),]
democratic_players <- add_aux_variables(democratic_players)

#democratic_players <- democratic_players[!is.na(democratic_players$correct_other_player_party) & democratic_players$correct_other_player_party,]
table(democratic_players$data.other_player_party, useNA="ifany")
democratic_players <- droplevels(democratic_players)

democratic_players$other_player_party <- ifelse(democratic_players$correct_other_player_party, "correct" , "incorrect")
democratic_players$assassination <- ifelse(democratic_players$after_assassination, "After", "Before")
democratic_players$assassination <- factor(democratic_players$assassination, levels=c("Before", "After"))
democratic_players <- as.data.frame(democratic_players)

players <- as.data.frame(rbind(democratic_players, republican_players))
control_players <- players[players$data.article == "Hashtag_Rock.png",]
patriotic_players <- players[players$data.article == "HotDog.png",]
enemy_players <- players[players$data.article == "SuperEnemy.png",]
control_enemy_players <- rbind(control_players, enemy_players)
control_patriotic_players <- rbind(control_players, patriotic_players)

republican_control_enemy_players <- control_enemy_players[control_enemy_players$data.political_affiliation=="republican",]
democrat_control_enemy_players <- control_enemy_players[control_enemy_players$data.political_affiliation=="democrat",]
####################
chisq.test(players$data.democrats, players$data.political_affiliation)
chisq.test(players$data.republicans, players$data.political_affiliation)
chisq.test(players$data.neighborhood, players$data.political_affiliation)
chisq.test(players$data.american, players$data.political_affiliation)
chisq.test(players$data.american, players$data.article)
chisq.test(republican_players$data.american, republican_players$data.article)
chisq.test(democratic_players$data.american, democratic_players$data.article)
chisq.test(players$data.democrats, players$data.article)
chisq.test(republican_players$data.democrats, republican_players$data.article)
chisq.test(democratic_players$data.democrats, democratic_players$data.article)
chisq.test(players$data.republicans, players$data.article)
chisq.test(republican_players$data.republicans, republican_players$data.article)
chisq.test(democratic_players$data.republicans, democratic_players$data.article)

chisq.test(players$data.american, players$after_assassination)
chisq.test(republican_players$data.american, republican_players$after_assassination)
chisq.test(democratic_players$data.american, democratic_players$after_assassination)
chisq.test(players$data.democrats, players$after_assassination)
chisq.test(republican_players$data.democrats, republican_players$after_assassination)
chisq.test(democratic_players$data.democrats, democratic_players$after_assassination)
chisq.test(players$data.republicans, players$after_assassination)
chisq.test(republican_players$data.republicans, republican_players$after_assassination)
chisq.test(democratic_players$data.republicans, democratic_players$after_assassination)


pdf_width <- 6.5 
pdf_height <- 5

###########################################################################
# How republicans and democrats vary in how they identify with americans
plot_data <- players %>% drop_na(data.political_affiliation, data.american) %>%
  group_by(data.political_affiliation, data.american) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.political_affiliation) %>%
  mutate(fraction = cnt/sum(cnt))

p <- ggplot(plot_data, aes(x = data.american, y = fraction, fill = data.political_affiliation)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Americans?", y="Fraction") +
  theme_bw() +
  guides(fill=guide_legend(title="Party\nAffiliation")) +
  scale_fill_manual(labels=c("democrat" = "Democrat", "republican"="Republican"),
                    values=c("dodgerblue3", "tomato2")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/american_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(players$data.american, players$data.political_affiliation)


###########################################################################
# How republicans identify with americans after reading the enemy article

plot_data <- republican_control_enemy_players %>% drop_na(data.article, data.american) %>%
  group_by(data.article, data.american) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.article) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data,
       aes(x = data.american, y = fraction, fill = data.article)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Americans?", y="Fraction") +
  scale_fill_manual(labels=c("Hashtag_Rock.png" = "Neutral (Control)", "SuperEnemy.png"="Common Enemy"),
                    values=c("wheat3", "sienna4")) +
  theme_bw() +
  guides(fill=guide_legend(title="Treament")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/republican_american_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(republican_control_enemy_players$data.american, republican_control_enemy_players$data.article)
chisq.test(republican_control_enemy_players$data.american, republican_control_enemy_players$data.article, simulate.p.value = TRUE, B=20000)
fisher.test(republican_control_enemy_players$data.american, republican_control_enemy_players$data.article)


###########################################################################
# How democrats identify with americans after reading the enemy article

plot_data <- democrat_control_enemy_players %>% drop_na(data.article, data.american) %>%
  group_by(data.article, data.american) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.article) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data,
       aes(x = data.american, y = fraction, fill = data.article)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Americans?", y="Fraction") +
  scale_fill_manual(labels=c("Hashtag_Rock.png" = "Neutral (Control)", "SuperEnemy.png"="Common Enemy"),
                    values=c("wheat3", "sienna4")) +
  theme_bw() +
  guides(fill=guide_legend(title="Treament")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/democrat_american_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(democrat_control_enemy_players$data.american, democrat_control_enemy_players$data.article)
chisq.test(democrat_control_enemy_players$data.american, democrat_control_enemy_players$data.article, simulate.p.value = TRUE, B=20000)
fisher.test(democrat_control_enemy_players$data.american, democrat_control_enemy_players$data.article)


###########################################################################
# How republicans identify with republicans and democrats after reading the enemy article

plot_data <- republican_control_enemy_players %>% drop_na(data.article, data.democrats) %>%
  group_by(data.article, data.democrats) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.article) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data,
       aes(x = data.democrats, y = fraction, fill = data.article)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Democrats?", y="Fraction") +
  scale_fill_manual(labels=c("Hashtag_Rock.png" = "Neutral (Control)", "SuperEnemy.png"="Common Enemy"),
                    values=c("wheat3", "sienna4")) +
  theme_bw() +
  guides(fill=guide_legend(title="Treament")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/republican_democrat_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(republican_control_enemy_players$data.democrats, republican_control_enemy_players$data.article)
chisq.test(republican_control_enemy_players$data.democrats, republican_control_enemy_players$data.article, simulate.p.value = TRUE, B=20000)
fisher.test(republican_control_enemy_players$data.democrats, republican_control_enemy_players$data.article)


plot_data <- republican_control_enemy_players %>% drop_na(data.article, data.republicans) %>%
  group_by(data.article, data.republicans) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.article) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data,
       aes(x = data.republicans, y = fraction, fill = data.article)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Democrats?", y="Fraction") +
  scale_fill_manual(labels=c("Hashtag_Rock.png" = "Neutral (Control)", "SuperEnemy.png"="Common Enemy"),
                    values=c("wheat3", "sienna4")) +
  theme_bw() +
  guides(fill=guide_legend(title="Treament")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/republican_republican_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(republican_control_enemy_players$data.republicans, republican_control_enemy_players$data.article)
chisq.test(republican_control_enemy_players$data.republicans, republican_control_enemy_players$data.article, simulate.p.value = TRUE, B=20000)
fisher.test(republican_control_enemy_players$data.republicans, republican_control_enemy_players$data.article)



  

###########################################################################
# How democrats identify with republicans and democrats after reading the enemy article

plot_data <- democrat_control_enemy_players %>% drop_na(data.article, data.democrats) %>%
  group_by(data.article, data.democrats) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.article) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data,
       aes(x = data.democrats, y = fraction, fill = data.article)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Democrats?", y="Fraction") +
  scale_fill_manual(labels=c("Hashtag_Rock.png" = "Neutral (Control)", "SuperEnemy.png"="Common Enemy"),
                    values=c("wheat3", "sienna4")) +
  theme_bw() +
  guides(fill=guide_legend(title="Treament")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/deomcrat_democrat_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(democrat_control_enemy_players$data.democrats, democrat_control_enemy_players$data.article)
chisq.test(democrat_control_enemy_players$data.democrats, democrat_control_enemy_players$data.article, simulate.p.value = TRUE, B=20000)
fisher.test(democrat_control_enemy_players$data.democrats, democrat_control_enemy_players$data.article)


plot_data <- democrat_control_enemy_players %>% drop_na(data.article, data.republicans) %>%
  group_by(data.article, data.republicans) %>% 
  summarise(cnt = n()) %>% 
  group_by(data.article) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data,
       aes(x = data.republicans, y = fraction, fill = data.article)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Democrats?", y="Fraction") +
  scale_fill_manual(labels=c("Hashtag_Rock.png" = "Neutral (Control)", "SuperEnemy.png"="Common Enemy"),
                    values=c("wheat3", "sienna4")) +
  theme_bw() +
  guides(fill=guide_legend(title="Treament")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/democrat_republican_identification.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(democrat_control_enemy_players$data.republicans, democrat_control_enemy_players$data.article)
chisq.test(democrat_control_enemy_players$data.republicans, democrat_control_enemy_players$data.article, simulate.p.value = TRUE, B=20000)
fisher.test(democrat_control_enemy_players$data.republicans, democrat_control_enemy_players$data.article)


###########################################################################
# How republicans identify with americans after the assassination

plot_data <- republican_players %>% drop_na(after_assassination, data.american) %>%
  group_by(after_assassination, data.american) %>% 
  summarise(cnt = n()) %>% 
  group_by(after_assassination) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data, aes(x = data.american, y = fraction, fill = after_assassination)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Americans?", y="Fraction") +
  scale_fill_manual(labels=c("FALSE" = "Before Iran Crisis", "TRUE"="During Iran Crisis"),
                    values=c("goldenrod", "springgreen3")) +
  theme_bw() +
  guides(fill=guide_legend(title="")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/republican_american_identification_assassination.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(republican_players$data.american, republican_players$after_assassination)
chisq.test(republican_players$data.american, republican_players$after_assassination, simulate.p.value = TRUE, B=20000)
fisher.test(republican_players$data.american, republican_players$after_assassination)

###########################################################################
# How democrats identify with americans after the assassination

plot_data <- democratic_players %>% drop_na(after_assassination, data.american) %>%
  group_by(after_assassination, data.american) %>% 
  summarise(cnt = n()) %>% 
  group_by(after_assassination) %>%
  mutate(fraction = cnt/sum(cnt))
p <- ggplot(plot_data, aes(x = data.american, y = fraction, fill = after_assassination)) + 
  geom_bar(stat="identity", position=position_dodge()) +
  labs(x="Identify with Americans?", y="Fraction") +
  scale_fill_manual(labels=c("FALSE" = "Before Iran Crisis", "TRUE"="During Iran Crisis"),
                    values=c("goldenrod", "springgreen3")) +
  theme_bw() +
  guides(fill=guide_legend(title="")) +
  theme(plot.title = element_text(hjust = 0.5, size=14),
        axis.text = element_text(size=10, color='black'),
        axis.title.y = element_text(size=14),
        axis.title.x = element_text(size=14, margin = margin(10,0,0,0, unit="pt")),
        legend.title= element_text(size=14),
        legend.text = element_text(size=11, color='black'))
p
ggsave(filename = "./results/exit-survey/democrat_american_identification_assassination.pdf", plot = p, width = pdf_width, height = pdf_height, units= "in")
chisq.test(democratic_players$data.american, democratic_players$after_assassination)
chisq.test(democratic_players$data.american, democratic_players$after_assassination, simulate.p.value = TRUE, B=20000)
fisher.test(democratic_players$data.american, democratic_players$after_assassination)





#### Feeling thermometers
plot_data <- players %>% select(data.political_affiliation, data.american_feel, data.democrats_feel, data.republicans_feel) %>%
  drop_na() %>%
  group_by(data.political_affiliation) %>%
  summarise(cnt=n(), across(everything(), list(mean=mean, sd=sd, se=~sd(.)/sqrt(length(.)))))
ggplot(plot_data, aes(x = data.political_affiliation, y = data.american_feel_mean)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.american_feel_mean-2*data.american_feel_se, ymax=data.american_feel_mean+2*data.american_feel_se))

ggplot(plot_data, aes(x = data.political_affiliation, y = data.democrats_feel_mean)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.democrats_feel_mean-2*data.democrats_feel_se, ymax=data.democrats_feel_mean+2*data.democrats_feel_se))
ggplot(plot_data, aes(x = data.political_affiliation, y = data.republicans_feel_mean)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.republicans_feel_mean-2*data.republicans_feel_se, ymax=data.republicans_feel_mean+2*data.republicans_feel_se))


plot_data <- players %>% select(data.political_affiliation, data.article, data.american_feel, data.democrats_feel, data.republicans_feel,
                                data.iranians_feel, data.chinese_feel, data.russians_feel) %>%
  drop_na() %>%
  group_by(data.political_affiliation, data.article) %>%
  summarise(cnt=n(), across(everything(), list(mean=mean, sd=sd, se=~sd(.)/sqrt(length(.)))))

ggplot(plot_data, aes(x = data.political_affiliation, y = data.american_feel_mean, fill=data.article)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.american_feel_mean-2*data.american_feel_se, ymax=data.american_feel_mean+2*data.american_feel_se),
                width=0.3, position=position_dodge(.9)) 
ggplot(plot_data, aes(x = data.political_affiliation, y = data.democrats_feel_mean, fill=data.article)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.democrats_feel_mean-2*data.democrats_feel_se, ymax=data.democrats_feel_mean+2*data.democrats_feel_se),
                width=0.3, position=position_dodge(.9)) 
ggplot(plot_data, aes(x = data.political_affiliation, y = data.republicans_feel_mean, fill=data.article)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.republicans_feel_mean-2*data.republicans_feel_se, ymax=data.republicans_feel_mean+2*data.republicans_feel_se),
                width=0.3, position=position_dodge(.9)) 
ggplot(plot_data, aes(x = data.political_affiliation, y = data.iranians_feel_mean, fill=data.article)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.iranians_feel_mean-2*data.iranians_feel_se, ymax=data.iranians_feel_mean+2*data.iranians_feel_se),
                width=0.3, position=position_dodge(.9)) 
ggplot(plot_data, aes(x = data.political_affiliation, y = data.chinese_feel_mean, fill=data.article)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.chinese_feel_mean-2*data.chinese_feel_se, ymax=data.chinese_feel_mean+2*data.chinese_feel_se),
                width=0.3, position=position_dodge(.9)) 
ggplot(plot_data, aes(x = data.political_affiliation, y = data.russians_feel_mean, fill=data.article)) +
  geom_bar(stat="identity", position=position_dodge()) +
  geom_errorbar(aes(ymin=data.russians_feel_mean-2*data.russians_feel_se, ymax=data.russians_feel_mean+2*data.russians_feel_se),
                width=0.3, position=position_dodge(.9)) 

