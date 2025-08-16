
import { Component } from 'horizon/core';
import { UIComponent, View, Text, Pressable, Binding, UINode } from 'horizon/ui';
import { Color } from 'horizon/core';

// Quiz question interface
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
}

class QuizUI extends UIComponent<typeof QuizUI> {
  // Game state
  private currentState = new Binding('start');
  private currentQuestionIndex = new Binding(0);
  private score = new Binding(0);
  private selectedAnswer = new Binding<number>(-1);
  private showFeedback = new Binding(false);
  private isAnswerCorrect = new Binding(false);
  private isSubmitted = new Binding(false);
  
  // Derived binding for showing submit button
  private showSubmitButton = new Binding(false);
  
  // Current values for state tracking
  private _currentQuestionIndex = 0;
  private _score = 0;
  private _isSubmitted = false;
  private _selectedAnswer = -1;

  // Quiz questions
  private questions: QuizQuestion[] = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3
    }
  ];

  preStart() {}

  start() {}

  initializeUI() {
    return View({
      style: {
        flex: 1,
        backgroundColor: new Color(0.1, 0.1, 0.2),
        padding: 15
      },
      children: [
        UINode.if(
          this.currentState.derive(state => state === 'start'),
          this.startScreen(),
          UINode.if(
            this.currentState.derive(state => state === 'question'),
            this.questionScreen(),
            this.resultScreen()
          )
        )
      ]
    });
  }

  // Start screen with title and start button
  private startScreen() {
    return View({
      style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      children: [
        Text({
          text: "🧠 HORIZON QUIZ 🧠",
          style: {
            fontSize: 28,
            fontWeight: 'bold',
            color: Color.white,
            textAlign: 'center',
            marginBottom: 10
          }
        }),
        Text({
          text: `Answer ${this.questions.length} questions and test your knowledge!`,
          style: {
            fontSize: 16,
            color: new Color(0.8, 0.8, 0.8),
            textAlign: 'center',
            marginBottom: 20
          }
        }),
        Pressable({
          children: Text({
            text: "START QUIZ",
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              color: Color.white,
            }
          }),
          onClick: () => {
            this.startQuiz();
          },
          style: {
            backgroundColor: Color.green,
            borderRadius: 8,
            width: 180,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }
        })
      ]
    });
  }

  // Question screen with multiple choice answers
  private questionScreen() {
    return View({
      style: {
        flex: 1,
        alignItems: 'center'
      },
      children: [
        // Progress indicator
        Text({
          text: this.currentQuestionIndex.derive(index => 
            `Question ${index + 1} of ${this.questions.length}`
          ),
          style: {
            fontSize: 14,
            color: new Color(0.8, 0.8, 0.8),
            textAlign: 'center',
            marginBottom: 15
          }
        }),

        // Question text
        Text({
          text: this.currentQuestionIndex.derive(index => 
            this.questions[index]?.question || ""
          ),
          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: Color.white,
            textAlign: 'center',
            marginBottom: 25,
            paddingHorizontal: 15
          }
        }),

        // Answer options
        ...this.createAnswerButtons(),

        // Feedback section
        UINode.if(
          this.showFeedback,
          View({
            style: {
              marginTop: 20,
              alignItems: 'center'
            },
            children: [
              Pressable({
                children: Text({
                  text: this.currentQuestionIndex.derive(index => 
                    index < this.questions.length - 1 ? "NEXT QUESTION" : "VIEW RESULTS"
                  ),
                  style: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: Color.white,
                  }
                }),
                onClick: () => {
                  this.nextQuestion();
                },
                style: {
                  backgroundColor: Color.blue,
                  borderRadius: 8,
                  width: 160,
                  height: 50,
                  marginBottom: 15,
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }),
              Text({
                text: this.isAnswerCorrect.derive(correct => 
                  correct ? "✅ Correct!" : "❌ Incorrect!"
                ),
                style: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: this.isAnswerCorrect.derive(correct => 
                    correct ? Color.green : Color.red
                  )
                }
              })
            ]
          }),
          // Submit button section (shown when answer is selected but not submitted)
          UINode.if(
            this.showSubmitButton,
            View({
              style: {
                marginTop: 20,
                alignItems: 'center'
              },
              children: [
                Pressable({
                  children: Text({
                    text: "SUBMIT ANSWER",
                    style: {
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: Color.white,
                      textAlign: 'center'
                    }
                  }),
                  onClick: () => {
                    this.submitAnswer();
                  },
                  style: {
                    backgroundColor: Color.green,
                    borderRadius: 8,
                    width: 160,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                })
              ]
            })
          )
        )
      ]
    });
  }

  // Create answer buttons for current question
  private createAnswerButtons() {
    const buttons = [];
    for (let i = 0; i < 4; i++) {
      buttons.push(
        Pressable({
          children: Text({
            text: this.currentQuestionIndex.derive(index => 
              this.questions[index]?.options[i] || ""
            ),
            style: {
              fontSize: 16,
              color: Color.black,
            }
          }),
          onClick: () => {
            if (!this._isSubmitted) {
              this.selectAnswer(i);
            }
          },
          style: {
            backgroundColor: Binding.derive([this.selectedAnswer, this.currentQuestionIndex, this.isSubmitted], (selected, questionIndex, submitted) => {
              if (!submitted) {
                return selected === i ? new Color(1, 1, 0) : Color.white; // Yellow for selected
              } else {
                const currentQuestion = this.questions[questionIndex];
                if (i === currentQuestion.correctAnswer) {
                  return Color.green; // Green for correct answer
                } else if (selected === i && i !== currentQuestion.correctAnswer) {
                  return Color.red; // Red for incorrect selected answer
                } else {
                  return Color.white;
                }
              }
            }),
            borderRadius: 8,
            width: 280,
            height: 50,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: this.selectedAnswer.derive(selected => 
              selected === i ? Color.blue : new Color(0.3, 0.3, 0.3)
            ),
            justifyContent: 'center',
            alignItems: 'center'
          }
        })
      );
    }
    return buttons;
  }

  // Results screen with score and restart button
  private resultScreen() {
    return View({
      style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      children: [
        Text({
          text: "🏆 QUIZ COMPLETE! 🏆",
          style: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Color.white,
            textAlign: 'center',
            marginBottom: 20
          }
        }),
        Text({
          text: "Your Score:",
          style: {
            fontSize: 20,
            color: new Color(0.8, 0.8, 0.8),
            textAlign: 'center',
            marginBottom: 10
          }
        }),
        Text({
          text: this.score.derive(score => 
            `${score} / ${this.questions.length}`
          ),
          style: {
            fontSize: 40,
            fontWeight: 'bold',
            color: this.score.derive(score => {
              const percentage = (score / this.questions.length) * 100;
              if (percentage >= 80) return Color.green;
              if (percentage >= 60) return new Color(1, 1, 0); // Yellow
              return Color.red;
            }),
            textAlign: 'center',
            marginBottom: 15
          }
        }),
        Text({
          text: this.score.derive(score => {
            const percentage = (score / this.questions.length) * 100;
            if (percentage >= 80) return "Excellent! 🌟";
            if (percentage >= 60) return "Good job! 👍";
            return "Keep practicing! 💪";
          }),
          style: {
            fontSize: 18,
            color: new Color(0.8, 0.8, 0.8),
            textAlign: 'center',
            marginBottom: 25
          }
        }),
        Pressable({
          children: Text({
            text: "PLAY AGAIN",
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              color: Color.white,
            }
          }),
          onClick: () => {
            this.restartQuiz();
          },
          style: {
            backgroundColor: Color.green,
            borderRadius: 8,
            width: 180,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }
        })
      ]
    });
  }

  // Game logic methods
  private startQuiz() {
    this.currentState.set('question');
    this._currentQuestionIndex = 0;
    this.currentQuestionIndex.set(0);
    this._score = 0;
    this.score.set(0);
    this._selectedAnswer = -1;
    this.selectedAnswer.set(-1);
    this.showFeedback.set(false);
    this._isSubmitted = false;
    this.isSubmitted.set(false);
    this.showSubmitButton.set(false);
  }

  private selectAnswer(answerIndex: number) {
    this._selectedAnswer = answerIndex;
    this.selectedAnswer.set(answerIndex);
    // Show submit button when answer is selected
    this.showSubmitButton.set(true);
  }

  private submitAnswer() {
    if (this._selectedAnswer === -1) return;
    
    // Check if answer is correct
    const currentQuestion = this.questions[this._currentQuestionIndex];
    const isCorrect = this._selectedAnswer === currentQuestion.correctAnswer;
    this.isAnswerCorrect.set(isCorrect);
    
    if (isCorrect) {
      this._score = this._score + 1;
      this.score.set(this._score);
    }
    
    // Mark as submitted and show feedback, hide submit button
    this._isSubmitted = true;
    this.isSubmitted.set(true);
    this.showFeedback.set(true);
    this.showSubmitButton.set(false);
  }

  private nextQuestion() {
    const nextIndex = this._currentQuestionIndex + 1;
    
    if (nextIndex < this.questions.length) {
      // Move to next question
      this._currentQuestionIndex = nextIndex;
      this.currentQuestionIndex.set(nextIndex);
      this._selectedAnswer = -1;
      this.selectedAnswer.set(-1);
      this.showFeedback.set(false);
      this._isSubmitted = false;
      this.isSubmitted.set(false);
      this.showSubmitButton.set(false);
    } else {
      // Quiz complete, show results
      this.currentState.set('result');
    }
  }

  private restartQuiz() {
    this.currentState.set('start');
    this._currentQuestionIndex = 0;
    this.currentQuestionIndex.set(0);
    this._score = 0;
    this.score.set(0);
    this._selectedAnswer = -1;
    this.selectedAnswer.set(-1);
    this.showFeedback.set(false);
    this._isSubmitted = false;
    this.isSubmitted.set(false);
    this.showSubmitButton.set(false);
  }
}

UIComponent.register(QuizUI);