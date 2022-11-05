meteor update empirica:core
# running locally
meteor --settings local.json

# deploying micro to the server
DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy question-answer-game --settings ./micro-deployment.json

# deploying macro to the server
DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy answer-question-game --settings ./macro-deployment.json

# deploying test to the server
DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy test-outsider-game --settings ./test-deployment.json
