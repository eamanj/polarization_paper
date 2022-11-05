library(survey)
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
republican_players <- add_aux_variables(republican_players)

#republican_players <- republican_players[!is.na(republican_players$data.senate) & republican_players$data.senate == "republicans",]
table(republican_players$data.senate, useNA="ifany")
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
democratic_players <- add_aux_variables(democratic_players)

#democratic_players <- democratic_players[!is.na(democratic_players$data.senate) & democratic_players$data.senate == "democratics",]
table(democratic_players$data.senate, useNA="ifany")
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
####################
# priming effect
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.gender", "data.senate")
data <- players[complete.cases(players[,control_vars]),]
data$strata <- apply(data[, control_vars], 1 , paste, collapse = "-")
data <- data %>% group_by_at(control_vars) %>% mutate(count = n())
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")

control <- data[data$data.article == "Hashtag_Rock.png",]
patriotic <- data[data$data.article == "HotDog.png",]
enemy <- data[data$data.article == "SuperEnemy.png",]

experiment_design <- svydesign(id = ~1, data = enemy)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
enemy_mean <- svymean(~corrected_update, design=experiment_design)
enemy_confints <- confint(enemy_mean, df=degf(experiment_design))
enemy_result <- cbind(as.data.frame(enemy_mean), as.data.frame(enemy_confints))

experiment_design <- svydesign(id = ~1, data = patriotic)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
patriotic_mean <- svymean(~corrected_update, design=experiment_design)
patriotic_confints <- confint(patriotic_mean, df=degf(experiment_design))
patriotic_result <- cbind(as.data.frame(patriotic_mean), as.data.frame(patriotic_confints))

experiment_design <- svydesign(id = ~1, data = control)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
control_mean <- svymean(~corrected_update, design=experiment_design)
control_confints <- confint(control_mean, df=degf(experiment_design))
control_result <- cbind(as.data.frame(control_mean), as.data.frame(control_confints))

result <- rbind(enemy_result, patriotic_result, control_result)
result <- cbind(article=c("Enemy", "Patriotic", "Control"), result)
colnames(result) <- c("article", "mean", "se", "ci_l", "ci_u")
rownames(result) <- result$article
result$article <- factor(result$article, levels=c("Control", "Patriotic", "Enemy"))
result

p <- ggplot(result, aes(article, mean, fill = article)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Priming Article') + ylab('Corrected Update')
p
#ggsave(paste0(results_dir, party, '_stratified_corrected_updates_primes.pdf'), p,  width = 6, height = 4, units = 'in')

# manual computation for control group
res <- control %>% group_by(strata) %>% summarize(mean_update=mean(corrected_update))
res <- merge(res, strata_freq, by='strata')
res$weight <- res$Freq / sum(res$Freq)
sum(res$weight * res$mean_update)

################################
# assassination effect
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.senate", "data.article", "data.gender")
data <- players[complete.cases(players[,control_vars]),]
data$strata <- apply(data[, control_vars], 1 , paste, collapse = "-")
data <- data %>% group_by_at(control_vars) %>% mutate(count = n())
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")

after_assassination <- data[data$after_assassination,]
before_assassination <- data[!data$after_assassination,]

experiment_design <- svydesign(id = ~1, data = after_assassination)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
after_mean <- svymean(~corrected_update, design=experiment_design)
after_confints <- confint(after_mean, df=degf(experiment_design))
after_result <- cbind(as.data.frame(after_mean), as.data.frame(after_confints))

experiment_design <- svydesign(id = ~1, data = before_assassination)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
before_mean <- svymean(~corrected_update, design=experiment_design)
before_confints <- confint(before_mean, df=degf(experiment_design))
before_result <- cbind(as.data.frame(before_mean), as.data.frame(before_confints))

result <- rbind(after_result, before_result)
result <- cbind(assassination=c("After", "Before"), result)
colnames(result) <- c("assassination", "mean", "se", "ci_l", "ci_u")
rownames(result) <- result$assassination
result$assassination <- factor(result$assassination, levels=c("Before", "After"))
result

p <- ggplot(result, aes(assassination, mean, fill = assassination)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Assassination') + ylab('Corrected Update')
p
#ggsave(paste0(results_dir, party, '_stratified_corrected_updates_assassination.pdf'), p,  width = 5, height = 4, units = 'in')

# manual computation for before group
res <- before_assassination %>% group_by(strata) %>% summarize(mean_update=mean(corrected_update))
res <- merge(res, strata_freq, by='strata')
res$weight <- res$Freq / sum(res$Freq)
sum(res$weight * res$mean_update)

################################
# top thermometer effect
party <- 'republican'
percentage <- 10
control_vars <- c("other_player_party", "response0_bin_unordered", "data.senate", "data.article", "data.gender")
data <- players[complete.cases(players[,control_vars]),]
data$strata <- apply(data[, control_vars], 1 , paste, collapse = "-")
data <- data %>% group_by_at(control_vars) %>% mutate(count = n())
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")

strong_var <- paste0("top", percentage, "pct_", "republican", "_feel")
data <- data[!is.na(data[[strong_var]]),]
strong_supporter <- data[data[[strong_var]],]
moderate_supporter <- data[!data[[strong_var]],]

experiment_design <- svydesign(id = ~1, data = strong_supporter)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
strong_mean <- svymean(~corrected_update, design=experiment_design)
strong_confints <- confint(strong_mean, df=degf(experiment_design))
strong_result <- cbind(as.data.frame(strong_mean), as.data.frame(strong_confints))

experiment_design <- svydesign(id = ~1, data = moderate_supporter)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
moderate_mean <- svymean(~corrected_update, design=experiment_design)
moderate_confints <- confint(moderate_mean, df=degf(experiment_design))
moderate_result <- cbind(as.data.frame(moderate_mean), as.data.frame(moderate_confints))

result <- rbind(strong_result, moderate_result)
result <- cbind(supporter=c("Strong", "Moderate"), result)
colnames(result) <- c("supporter", "mean", "se", "ci_l", "ci_u")
rownames(result) <- result$supporter
result$supporter <- factor(result$supporter, levels=c("Moderate", "Strong"))
result

p <- ggplot(result, aes(supporter, mean, fill = supporter)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Party Support') + ylab('Corrected Update')
p
#ggsave(paste0(results_dir, party, '_stratified_corrected_updates_support.pdf'), p,  width = 5, height = 4, units = 'in')

# manual computation for moderate group
res <- moderate_supporter %>% group_by(strata) %>% summarize(mean_update=mean(corrected_update))
res <- merge(res, strata_freq, by='strata')
res$weight <- res$Freq / sum(res$Freq)
sum(res$weight * res$mean_update)






########################################################################
# Design code that also produces design-based t-tests
#party_data <- democratic_players
party_data <- republican_players

################################
# priming effect
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.gender", "data.senate")
#control_vars <- c("other_player_party", "response0_bin2_unordered", "data.gender")
data <- party_data[complete.cases(party_data[,control_vars]),]
data$strata <- apply(data[,control_vars], 1 , paste, collapse = "-")
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")
# now we can limit the data to treatments after we have counted each strata across who population
data <- data[data$data.article %in% c("Hashtag_Rock.png", "SuperEnemy.png"),]
#data <- data[data$data.article %in% c("Hashtag_Rock.png", "HotDog.png"),]

# add the article to strata definition, but replicate the frequencies.
strata_freq <- crossing(strata_freq, article=unique(data$data.article))
strata_freq$strata <- paste(strata_freq$strata, strata_freq$article, sep='-')
strata_freq$article <- NULL
# fix the strata definition in data so it also includes article
data$strata <- paste(data$strata, data$data.article, sep='-')


experiment_design <- svydesign(id = ~1, data = data)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
#svymean(~corrected_update, design=experiment_design)
result <- svyby(~corrected_update, by=~data.article, design=experiment_design, FUN=svymean, vartype=c("se", "ci"))
# adjust conf intervals to be from t-distribution
confidence_ints <- as.data.frame(confint(result, df=degf(experiment_design)))
colnames(confidence_ints) <- c("ci_l", "ci_u")
result$ci_l <- confidence_ints$ci_l
result$ci_u <- confidence_ints$ci_u
result
svyttest(corrected_update ~ data.article, experiment_design)

p <- ggplot(result, aes(data.article, corrected_update, fill = data.article)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_stratified_corrected_updates_primes.pdf'), p,  width = 6, height = 4, units = 'in')

# compare democratic and republican in super enemy
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.gender", "data.senate")
republican_super_enemy <- republican_players[republican_players$data.article == "SuperEnemy.png",]
democratic_super_enemy <- democratic_players[democratic_players$data.article == "SuperEnemy.png",]
data <- rbind(republican_super_enemy, democratic_super_enemy)
data <- data[complete.cases(data[,control_vars]),]
data$strata <- apply(data[,control_vars], 1 , paste, collapse = "-")
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")

# add the party to strata definition, but replicate the frequencies.
strata_freq <- crossing(strata_freq, party=unique(data$data.political_affiliation))
strata_freq$strata <- paste(strata_freq$strata, strata_freq$party, sep='-')
strata_freq$party <- NULL
# fix the strata definition in data so it also includes party
data$strata <- paste(data$strata, data$data.political_affiliation, sep='-')


experiment_design <- svydesign(id = ~1, data = data)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
#svymean(~corrected_update, design=experiment_design)
result <- svyby(~corrected_update, by=~data.political_affiliation, design=experiment_design, FUN=svymean, vartype=c("se", "ci"))
# adjust conf intervals to be from t-distribution
confidence_ints <- as.data.frame(confint(result, df=degf(experiment_design)))
colnames(confidence_ints) <- c("ci_l", "ci_u")
result$ci_l <- confidence_ints$ci_l
result$ci_u <- confidence_ints$ci_u
result
svyttest(corrected_update ~ data.political_affiliation, experiment_design)



################################
# assassination effect
#control_vars <- c("other_player_party", "response0_bin2_unordered", "data.article", "data.gender")
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.senate", "data.article", "data.gender")
data <- party_data[complete.cases(party_data[,control_vars]),]
data$strata <- apply(data[,control_vars], 1 , paste, collapse = "-")
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")
# add the assassination to strata definition, but replicate the frequencies.
strata_freq <- crossing(strata_freq, assassination=unique(data$assassination))
strata_freq$strata <- paste(strata_freq$strata, strata_freq$assassination, sep='-')
strata_freq$assassination <- NULL
# fix the strata definition in data so it also includes article
data$strata <- paste(data$strata, data$assassination, sep='-')

experiment_design <- svydesign(id = ~1, data = data)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
#svymean(~corrected_update, design=experiment_design)
result <- svyby(~corrected_update, by=~assassination, design=experiment_design, FUN=svymean, vartype=c("se", "ci"))
# adjust conf intervals to be from t-distribution
confidence_ints <- as.data.frame(confint(result, df=degf(experiment_design)))
colnames(confidence_ints) <- c("ci_l", "ci_u")
result$ci_l <- confidence_ints$ci_l
result$ci_u <- confidence_ints$ci_u
result
svyttest(corrected_update ~ assassination, experiment_design)

p <- ggplot(result, aes(assassination, corrected_update, fill = assassination)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_stratified_corrected_updates_assassination.pdf'), p,  width = 5, height = 4, units = 'in')


################################
# top thermometer effect
percentage <- 10
strong_var1 <- paste0("top", percentage, "pct_", "affective_polarization")
strong_var2 <- paste0("top", percentage, "pct_", "republican_feel")
strong_var <- strong_var1
party_data$republican_type <- ifelse(party_data[[strong_var]], "Strong", "Moderate")
party_data$republican_type <- factor(party_data$republican_type, levels=c("Moderate", "Strong"))

#control_vars <- c("other_player_party", "response0_bin2_unordered", "data.article", "data.gender")
#control_vars <- c("other_player_party", "response0_bin2_unordered", "data.senate", "data.gender")
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.senate", "data.article", "data.gender")
data <- party_data[complete.cases(party_data[,c(control_vars, strong_var)]),]
#data <- data[data$data.article == "SuperEnemy.png",]
data$strata <- apply(data[,control_vars], 1 , paste, collapse = "-")
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")
# add the party strength to strata definition, but replicate the frequencies.
strata_freq <- crossing(strata_freq, type=unique(data$republican_type))
strata_freq$strata <- paste(strata_freq$strata, strata_freq$type, sep='-')
strata_freq$type <- NULL
# fix the strata definition in data so it also includes article
data$strata <- paste(data$strata, data$republican_type, sep='-')

experiment_design <- svydesign(id = ~1, data = data)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
#svymean(~corrected_update, design=experiment_design)
result <- svyby(~corrected_update, by=~republican_type, design=experiment_design, FUN=svymean, vartype=c("se", "ci"))
# adjust conf intervals to be from t-distribution
confidence_ints <- as.data.frame(confint(result, df=degf(experiment_design)))
colnames(confidence_ints) <- c("ci_l", "ci_u")
result$ci_l <- confidence_ints$ci_l
result$ci_u <- confidence_ints$ci_u
result
svyttest(corrected_update ~ republican_type, experiment_design)

p <- ggplot(result, aes(republican_type, corrected_update, fill = republican_type)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_stratified_corrected_updates_support.pdf'), p,  width = 5, height = 4, units = 'in')


################################
# republicans vs democrats in enemey prime
control_vars <- c("other_player_party", "response0_bin2_unordered", "data.senate", "data.gender")
data <- enemy_players[complete.cases(enemy_players[,control_vars]),]
data$strata <- apply(data[,control_vars], 1 , paste, collapse = "-")
strata_freq <- data %>% group_by(strata) %>% tally(name="Freq")
# add the party to strata definition, but replicate the frequencies.
strata_freq <- crossing(strata_freq, party=unique(data$data.political_affiliation))
strata_freq$strata <- paste(strata_freq$strata, strata_freq$party, sep='-')
strata_freq$party <- NULL
# fix the strata definition in data so it also includes article
data$strata <- paste(data$strata, data$data.political_affiliation, sep='-')

experiment_design <- svydesign(id = ~1, data = data)
experiment_design <- postStratify(design = experiment_design, strata = ~strata, population=strata_freq, partial=TRUE)
#svymean(~corrected_update, design=experiment_design)
result <- svyby(~corrected_update, by=~data.political_affiliation, design=experiment_design, FUN=svymean, vartype=c("se", "ci"))
# adjust conf intervals to be from t-distribution
confidence_ints <- as.data.frame(confint(result, df=degf(experiment_design)))
colnames(confidence_ints) <- c("ci_l", "ci_u")
result$ci_l <- confidence_ints$ci_l
result$ci_u <- confidence_ints$ci_u
result
svyttest(corrected_update ~ data.political_affiliation, experiment_design)

p <- ggplot(result, aes(data.political_affiliation, corrected_update, fill = data.political_affiliation)) +
  theme_bw() + theme(legend.position = "none", plot.title = element_text(hjust = 0.5)) +
  geom_bar(stat='identity') +
  geom_errorbar(aes(ymin=ci_l, ymax=ci_u)) +
  xlab('Priming Article') + ylab('Corrected Update')
p
ggsave(paste0(results_dir, party, '_stratified_corrected_updates_assassination.pdf'), p,  width = 5, height = 4, units = 'in')
