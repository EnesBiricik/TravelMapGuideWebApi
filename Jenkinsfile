pipeline {
    agent any

    stages {
        
        stage('nginx Debug') {
            steps {
                sh '''
                    pwd
                    ls -la
                    ls -la nginx/ || echo "nginx klasörü yok!"
                    find . -name "nginx.conf" || echo "nginx.conf bulunamadı!"
                '''
            }
        }

        stage('Docker Compose Down') {
            steps {
                script {
                    sh 'docker compose -f ./docker-compose.yml down || true'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'timeout 500 docker compose -f ./docker-compose.yml build '
                    sh '''
                    if [ $? -eq 124 ]; then
                        echo "Build işlemi zaman aşımına uğradı!"
                        exit 1
                    fi
                    '''
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    sh 'docker compose -f ./docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline tamamlandı.'
        }
        failure {
            echo 'Pipeline başarısız oldu.'
        }
    }
}