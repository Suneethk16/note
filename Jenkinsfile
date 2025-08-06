pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://your-git-repo-url' // Replace with your repo URL
            }
        }
        stage('Build Backend Image') {
            steps {
                script {
                    sh 'docker build -t your-docker-hub-username/backend-notes:latest ./backend'
                }
            }
        }
        stage('Build Frontend Image') {
            steps {
                script {
                    sh 'docker build -t your-docker-hub-username/frontend-notes:latest ./frontend'
                }
            }
        }
        stage('Push Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                        sh 'docker push your-docker-hub-username/backend-notes:latest'
                        sh 'docker push your-docker-hub-username/frontend-notes:latest'
                    }
                }
            }
        }
    }
}