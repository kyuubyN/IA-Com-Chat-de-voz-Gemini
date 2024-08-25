document.addEventListener('DOMContentLoaded', function () {
            const buttonContainer = document.getElementById('button-container');
            const button = document.getElementById('button');
            const recognizedText = document.getElementById('recognized-text');
            const aiResponse = document.getElementById('ai-response');
            let isRecognizing = false;
            let recognition;
            let utterance;

            button.addEventListener('click', function () {
                if (!isRecognizing) {
                    startRecognition();
                } else {
                    stopRecognition();
                }
            });

            function startRecognition() {
                isRecognizing = true;
                buttonContainer.classList.add('active');
                button.classList.add('active');

                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                    console.error('Speech Recognition API não suportada no seu navegador.');
                    recognizedText.innerText = 'Speech Recognition API não suportada no seu navegador.';
                    resetButton();
                    return;
                }
                recognition = new SpeechRecognition();
                recognition.lang = 'pt-BR';
                recognition.start();
                recognition.onresult = (event) => {
                    const text = event.results[0][0].transcript;
                    recognizedText.innerText = `User: ${text}`;
                    fetch('/iniciar_chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.message);
                            utterance = new SpeechSynthesisUtterance(data.message);
                            speechSynthesis.speak(utterance);
                            aiResponse.innerText = `IA: ${data.message}\n`;
                            utterance.onend = resetButton;
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            resetButton();
                        });
                };
                recognition.onerror = (event) => {
                    console.error('Erro no reconhecimento de fala:', event.error);
                    recognizedText.innerText = `Erro no reconhecimento de fala: ${event.error}`;
                    resetButton();
                };
            }
            function stopRecognition() {
                if (recognition) {
                    recognition.stop();
                    recognition = null;
                }
                if (utterance) {
                    speechSynthesis.cancel();
                    utterance = null;
                }
                resetButton();
            }
            function resetButton() {
                isRecognizing = false;
                buttonContainer.classList.remove('active');
                button.classList.remove('active');
            }
        });
