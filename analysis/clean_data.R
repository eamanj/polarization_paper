library(dplyr)
setwd("~/research/polarization/outsider/")

# define a parser for Date Format in read.csv
setClass('myDate')
setAs('character', 'myDate', function(from) strptime(from, format = "%Y-%m-%dT%H:%M:%OSZ", tz="GMT"))

opposite_party <- function(polit_party) {
  #stopifnot(party %in% c('republican', 'democratic'))
  oppos_p <- 'republican'
  if(polit_party == 'republican') {
    oppos_p <- 'democratic'
  }
  return(oppos_p)
}

clean_data <- function(players_file) {
  players <- read.csv(players_file, row.names=NULL, header=TRUE, na.strings = c(""),
                      colClasses=c("data.responses"="character", "data.last_responses"="character",
                                   "X_id"="character", "id"="character",
                                   "createdAt"="myDate",
                                   "data.response0TimeAt"="myDate",
                                   "data.response1TimeAt"="myDate",
                                   "data.response2TimeAt"="myDate",
                                   "data.response3TimeAt"="myDate",
                                   "data.response4TimeAt"="myDate"))
  
  # remove players that do not have any political affiliation
  players <- players[!is.na(players$data.political_affiliation),]
  
  # Get the number of responses submitted, either through responses or last_responses (moved cursor)
  responses_list <- lapply(strsplit(players$data.responses, ","), function(x){ x[!x == ""] })
  players$num_responses <- sapply(responses_list, length)
  last_responses_list <- lapply(strsplit(players$data.last_responses, ","), function(x){ x[!x == ""] })
  players$num_last_responses <- sapply(last_responses_list, length)
  players$max_num_responses <- pmax(players$num_responses, players$num_last_responses)
  
  # create variables that indicate whether player did not submit or did not enter/move the slider
  # in each stage
  players$missing_response0 <- is.na(players$data.response0)
  players$missing_response1 <- is.na(players$data.response1)
  players$missing_response2 <- is.na(players$data.response2)
  players$missing_response3 <- is.na(players$data.response3)
  players$missing_response4 <- is.na(players$data.response4)
  
  players$missing_last_response0 <- is.na(players$data.last_response0)
  players$missing_last_response1 <- is.na(players$data.last_response1)
  players$missing_last_response2 <- is.na(players$data.last_response2)
  players$missing_last_response3 <- is.na(players$data.last_response3)
  players$missing_last_response4 <- is.na(players$data.last_response4)
  # discard test instance
  players$test_discard <- grepl("test", tolower(players$id))
  players <- players[!players$test_discard,]

  for(i in 0:4) {
    players[,paste0("response", i)] <- ifelse(!is.na(players[,paste0("data.response", i)]),
                                              players[,paste0("data.response", i)],
                                              players[,paste0("data.last_response", i)])
  }
  
  # remove id column so turkers cannot be identified
  players$id <- NULL
  # add columns that correspond to neighbor responses and last responses
  neighbor_responses <- players[,c("data.neighbor_ids", paste0("data.response", 0:4))]
  colnames(neighbor_responses) <- c("data.neighbor_ids", paste0("neighbor_response", 0:4))
  players <- merge(players, neighbor_responses, by.x="X_id", by.y="data.neighbor_ids", all.x=TRUE)
  
  neighbor_last_responses <- players[,c("data.neighbor_ids", paste0("data.last_response", 0:4))]
  colnames(neighbor_responses) <- c("data.neighbor_ids", paste0("neighbor_last_response", 0:4))
  players <- merge(players, neighbor_responses, by.x="X_id", by.y="data.neighbor_ids", all.x=TRUE)
  
  # convert some variables to factors
  players$data.knowledge <- factor(players$data.knowledge,
                                   levels=c("very-unknowledgeable", "unknowledgeable", "slightly-unknowledgeable",
                                            "neither-unknowledgeable-knowledgable",
                                            "slightly-knowledgeable", "knowledgeable", "very-knowledgeable"),
                                   ordered=TRUE)
  players$data.republicans <- factor(players$data.republicans,
                                     levels=c("strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"),
                                     labels=c("Strongly\ndisagree", "Disagree", "Neither agree\nnor disagree", "Agree", "Strongly\nagree"),
                                     ordered=TRUE)
  players$data.democrats <- factor(players$data.democrats,
                                   levels=c("strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"),
                                   labels=c("Strongly\ndisagree", "Disagree", "Neither agree\nnor disagree", "Agree", "Strongly\nagree"),
                                   ordered=TRUE)
  players$data.american <- factor(players$data.american,
                                  levels=c("strong_disagree", "disagree", "no_agree_disagree", "agree", "strong_agree"),
                                  labels=c("Strongly\ndisagree", "Disagree", "Neither agree\nnor disagree", "Agree", "Strongly\nagree"),
                                  ordered=TRUE)
  
  # short version of knowledge
  players$data.short_knowledge <- sapply(players$data.knowledge, switch,
                                         "very-unknowledgeable" = "VU", "unknowledgeable" = "U",
                                         "slightly-unknowledgeable" = "SU",
                                         "neither-unknowledgeable-knowledgable" = "NUK",
                                         "slightly-knowledgeable" = "SK", "knowledgeable" = "K",
                                         "very-knowledgeable"= "VK", "NA"=NA, NA)
  players$data.short_knowledge <- factor(players$data.short_knowledge,
                                         levels=c("VU", "U", "SU", "NUK", "SK", "K", "VK"),
                                         ordered=TRUE)
  
  return(players)
}

merge_games_data <- function(data, game_file) {
  games <- read.csv(game_file, row.names=NULL, header=TRUE,
                    na.strings = c(""),
                    colClasses=c("X_id"="character", "playerIds"="character",
                                 "createdAt"="myDate"))
  # split players into two player columns
  games[,c("player_id1", "player_id2")] <- do.call('rbind', strsplit(as.character(games$playerIds), split=','))
  games <- games[,c("X_id", "player_id1", "player_id2")]
  colnames(games) <- c("game_id", "player_id1", "player_id2")
  
  # now merge games with players data, noting that player id can be in either player_id1 or player_id2
  data <- merge(data, games, by.x="X_id", by.y="player_id1", all.x=TRUE)
  data <- merge(data, games, by.x="X_id", by.y="player_id2", all.x=TRUE)
  data$game_id <- ifelse(is.na(data$game_id.x), data$game_id.y, data$game_id.x)
  data$game_id.x <- NULL
  data$game_id.y <- NULL
  data$player_id1 <- NULL
  data$player_id2 <- NULL
  return(data)
}

merge_stages_data <- function(data, stage_file) {
  # use character for StartTimeAt because it looks like reshape cannot handle date times. convert back to time later 
  stages <- read.csv(stage_file, row.names=NULL, header=TRUE,
                     na.strings = c(""),
                     colClasses=c("X_id"="character", "gameId"="character",
                                  "createdAt"="myDate", "startTimeAt"="character"))
  stages <- stages[,c("gameId", "index", "startTimeAt")]
  unique_stages <- unique(stages$index)
  # widen the data by bringing different stages into columns so startTimes for all stages of the same game are in
  # one row
  stages <- reshape(stages, idvar="gameId", timevar="index", direction="wide")
  # convert date times back from string since reshape cannot handle datetime type
  stage_cols <- colnames(stages)[colnames(stages) != "gameId"]
  for(col in stage_cols) {
    stages[[col]] <- strptime(stages[[col]], format = "%Y-%m-%dT%H:%M:%OSZ", tz="GMT")
  }
  # add stage to column names
  colnames(stages)[colnames(stages) != "gameId"] <- paste0("Stage", stage_cols)
  
  # now merge games with players data, noting that player id can be in either player_id1 or player_id2
  data <- merge(data, stages, by.x="game_id", by.y="gameId", all.x=TRUE)
  
  # add duration of each stage
  for(s in unique_stages) {
    dur <- as.numeric(difftime(data[[paste0("data.response", s, "TimeAt")]], data[[paste0("StagestartTimeAt.", s)]], units="secs"))
    data[paste0("DurationStage", s)] <- dur
  }
  return(data)
}



clean_democratic_republican_data <- function(data_dir) {
  republican_data <- clean_data(paste0(data_dir, '/republican/players.csv'))
  democratic_data <- clean_data(paste0(data_dir, '/democratic/players.csv'))
  
  # add games info 
  republican_data <- merge_games_data(republican_data, paste0(data_dir, '/republican/games.csv'))
  democratic_data <- merge_games_data(democratic_data, paste0(data_dir, '/democratic/games.csv'))
  # add stage info 
  republican_data <- merge_stages_data(republican_data, paste0(data_dir, '/republican/stages.csv'))
  democratic_data <- merge_stages_data(democratic_data, paste0(data_dir, '/democratic/stages.csv'))
  
  republican_players <- republican_data[is.na(republican_data$bot),]
  republican_counterbots <- republican_data[!is.na(republican_data$bot) & republican_data$bot == "Bob",]
  democratic_players <- democratic_data[is.na(democratic_data$bot),]
  democratic_counterbots <- democratic_data[!is.na(democratic_data$bot) & democratic_data$bot == "Bob",]
  
  # move democratics in republican data to democratic_data and vice-versa.
  democratic_players <- rbind(democratic_players, republican_players[republican_players$data.political_affiliation == "democrat",])
  republican_players <- rbind(republican_players, democratic_players[democratic_players$data.political_affiliation == "republican",])
  democratic_players <- democratic_players[democratic_players$data.political_affiliation == "democrat",]
  republican_players <- republican_players[republican_players$data.political_affiliation == "republican",]
  
  democratic_counterbots <- rbind(democratic_counterbots, republican_counterbots[republican_counterbots$data.political_affiliation == "republican",])
  republican_counterbots <- rbind(republican_counterbots, democratic_counterbots[democratic_counterbots$data.political_affiliation == "democrat",])
  democratic_counterbots <- democratic_counterbots[democratic_counterbots$data.political_affiliation == "republican",]
  republican_counterbots <- republican_counterbots[republican_counterbots$data.political_affiliation == "democrat",]

  # keep all data frames in list named by party of the players/bots
  party_players <- list("democratic_players" = democratic_players, "democratic_counterbots" = democratic_counterbots,
                        "republican_players" = republican_players, "republican_counterbots" = republican_counterbots)
  return(party_players) 
}

add_aux_variables <- function(data) {
  data$after_assassination <- (data$createdAt > "2020-01-01")
  data$update <- data$data.response1 - data$data.response0
  data$corrected_update <- data$update * (ifelse(data$data.response0 < data$neighbor_response0, +1, -1))
  data$max_possible_update <- pmax(data$response0, 100 - data$response0)
  data$distance_to_50 <- abs(data$response0 - 50)
  data$response0_diff <- data$neighbor_response0 - data$data.response0
  data$sign_response0_diff <- sign(data$response0_diff)
  data$correct_other_player_party <- (data$data.other_player_party == sapply(data$data.political_affiliation, opposite_party))
  data$age_bin <- factor(as.integer(data$data.age/20),
                         levels=seq(0,4,1),
                         labels=paste0(seq(0,80,20), "-", seq(20,100,20)),
                         ordered=TRUE)
  
  data$affective_polarization <- ifelse(data$data.political_affiliation == 'democrat',
                                        data$data.democrats_feel - data$data.republicans_feel,
                                        data$data.republicans_feel - data$data.democrats_feel)
  data$top10pct_affective_polarization <- (data$affective_polarization >= quantile(data$affective_polarization, 0.9, na.rm=TRUE))
  data$top20pct_affective_polarization <- (data$affective_polarization >= quantile(data$affective_polarization, 0.8, na.rm=TRUE))
  data$top30pct_affective_polarization <- (data$affective_polarization >= quantile(data$affective_polarization, 0.7, na.rm=TRUE))
  data$top50pct_affective_polarization <- (data$affective_polarization >= quantile(data$affective_polarization, 0.5, na.rm=TRUE))
  data$top75pct_affective_polarization <- (data$affective_polarization >= quantile(data$affective_polarization, 0.25, na.rm=TRUE))
  
  
  data$top10pct_republican_feel <- (data$data.republicans_feel >= quantile(data$data.republicans_feel, 0.9, na.rm=TRUE))
  data$top20pct_republican_feel <- (data$data.republicans_feel >= quantile(data$data.republicans_feel, 0.8, na.rm=TRUE))
  data$top30pct_republican_feel <- (data$data.republicans_feel >= quantile(data$data.republicans_feel, 0.7, na.rm=TRUE))
  data$top50pct_republican_feel <- (data$data.republicans_feel >= quantile(data$data.republicans_feel, 0.5, na.rm=TRUE))
  data$top75pct_republican_feel <- (data$data.republicans_feel >= quantile(data$data.republicans_feel, 0.25, na.rm=TRUE))
  data$top10pct_democratic_feel <- (data$data.democrats_feel >= quantile(data$data.democrats_feel, 0.9, na.rm=TRUE))
  data$top20pct_democratic_feel <- (data$data.democrats_feel >= quantile(data$data.democrats_feel, 0.8, na.rm=TRUE))
  data$top30pct_democratic_feel <- (data$data.democrats_feel >= quantile(data$data.democrats_feel, 0.7, na.rm=TRUE))
  data$top50pct_democratic_feel <- (data$data.democrats_feel >= quantile(data$data.democrats_feel, 0.5, na.rm=TRUE))
  data$top75pct_democratic_feel <- (data$data.democrats_feel >= quantile(data$data.democrats_feel, 0.25, na.rm=TRUE))
  
  data$response0_bin <- factor(as.integer(data$response0/10),
                               levels=seq(0,10,1),
                               labels=c(paste0(seq(0,90,10), "-", seq(10,100,10)), "100"),
                               ordered=TRUE)
  data$response0_bin_unordered <- factor(data$response0_bin, ordered=F)
  data$response0_bin1 <- factor(as.integer(data$response0/5),
                                levels=seq(0,20,1),
                                labels=c(paste0(seq(0,95,5), "-", seq(5,100,5)), "100"),
                                ordered=TRUE)
  data$response0_bin1_unordered <- factor(data$response0_bin1, ordered=F)
  data$response0_bin2 <- factor(as.integer(data$response0/25),
                                levels=seq(0,4,1),
                                labels=c(paste0(seq(0,75,25), "-", seq(25,100,25)), "100"),
                                ordered=TRUE)
  data$response0_bin2_unordered <- factor(data$response0_bin2, ordered=F)
  data$response0_bin3 <- factor(cut(data$response0, breaks=c(0, 15, 30, 50, 101), labels=c("0-15", "15-30", "30-50", "50-100")),
                                ordered=TRUE)
  data$response0_bin3_unordered <- factor(data$response0_bin3, ordered=F)
  data$response0_bin4 <- factor(cut(data$response0, breaks=c(0, 25, 50, 101), labels=c("0-25", "20-50", "50-100")),
                                ordered=TRUE)
  data$response0_bin4_unordered <- factor(data$response0_bin4, ordered=F)
  
  data <- data %>% group_by(response0_bin) %>% mutate(response0_bin_prop=n()/nrow(data))
  return(data)
}
