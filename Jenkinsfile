pipeline {
    agent any

    tools{
        maven 'maven3'
    }
	environment{
        SCANNER_HOME=tool 'sonar-scanner'
    }
    stages {
        stage('Git-Checkput') {
            steps {
            git branch: 'main', changelog: false, poll: false, url: 'https://github.com/ASHUBHAIYA/Blue-Green-Deployment.git'    
            }
        }
    
        stage('Compile') {
            steps {
                sh 'mvn compile'
            }
        }
       stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-scanner') {
                    sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectKey=nodejsmysql -Dsonar.projectName=nodejsmysql -Dsonar.java.binaries=. "
                }
            }
        }
        stage('Build') {
            steps {
                sh 'mvn package -DskipTests=true'
            }
        }
        stage('Docker-Image') {
            steps {
                script{
                sh 'docker image build -t abhishek791996/devop_java_app:v$BUILD .'
                sh 'docker image tag abhishek791996/devop_java_app:v$BUILD abhishek791996/devop_java_app:latest'
                }
            }
        }
    }
}
