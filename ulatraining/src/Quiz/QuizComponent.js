import React from 'react';
import generateQuestion from "./QuestionComponent.js"
import quizData from "./QuizTemplate.json"

class QuizComponent extends React.Component
{
  constructor(props)
  {
    super(props);
    this.database = props.database;
    this.uid = props.uid; // user id
    this.course = props.cid;
    this.quizid = props.mid;

    //this.course = this.props.match.params.cid; // course name
    //this.quizid = this.props.match.params.mid;

    this.state = {
      mod: props.mod, // the zero-based index of the module
      name: "",
      content: "",
      questions: [],
      questionData: [],
      submitted: false,
      quizData: props.content
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createQuestionData = this.createQuestionData.bind(this);
    //this.fetchQuiz = this.fetchQuiz.bind(this);
    this.nextModule = this.nextModule.bind(this);
    this.previousModule = this.previousModule.bind(this);
  }

  /*
  fetchQuiz() {
    let path = "courses/" + this.course + '/modules/' + this.quizid;
    let modulesdb = this.database.ref("courses/" + this.course + '/modules/' + this.quizid);
    modulesdb.on('value', snapshot => {
      this.setState({quizData: snapshot.val()}, this.createQuestionData);
    })
    console.log(this.state.quizData);
  }
  */

  componentDidMount() {
    //this.fetchQuiz();
    this.createQuestionData();

  }

  createQuestionData() {
    for (let i = 0; i < this.state.quizData.questionNum;i++) {
      this.state.questionData[i] = new Set();
    }
    for (let x = 0; x < this.state.quizData.questionNum; x++) {
      console.log(this.renderQuestion(x));
      this.state.questions = [...this.state.questions, this.renderQuestion(x)]
      }
    this.forceUpdate();
  }

  renderQuestion(num) {
    return generateQuestion(this.state.quizData.questions[num], num, this.state.questionData);
  }

  getQuizResult() {
    //interact with firebase, answers shouldn't be available to public
    let max_credit = 0;
    let credit_earned = 0.0;
    for (let i = 0; i < this.state.quizData.questions.length; i++) {
      let q = this.state.quizData.questions[i];
      if (q.correctChoices) { //no correct answer
        max_credit += 1;
        if (q.type === "mco") { //can only choose one answer, multiple may be correct
          for (let answer of this.state.questionData[i]) {
            if (q.correctChoices.includes(answer)) {
              credit_earned += 1;
            }
          }
        } else if (q.type === "mcm") {
          let total_choices = q.choice_num;
          let total_correct_choices = q.correctChoices.length;
          let correct_selected = 0;
          let incorrect_selected = 0;
          for (let answer of this.state.questionData[i]) {
            if (q.correctChoices.includes(answer)) {
              correct_selected += 1.0;
            } else {
              incorrect_selected += 1.0;
            }
          }
          if (!q.partial_credit) {
            if (correct_selected === total_correct_choices && incorrect_selected === 0) {
              credit_earned += 1.0;
            }
          } else {

            credit_earned += 1.0 - ((total_correct_choices - correct_selected) + (incorrect_selected)) / total_choices;
          }
        }
      }
    }
    return credit_earned / max_credit;

  }

  handleSubmit(event) {
    event.preventDefault();
    // for (let i = 0; i < this.state.questions.length; i++) {
    //   alert(this.state.questions[i].props.answer);
    // }
    this.setState({submitted: true})
  }

  nextModule(event) {
    //do Something
    window.location.href=`/course/${this.course}`
  }

  previousModule(event) {
    //do Something
    window.location.href=`/course/${this.course}`
  }

  render()
  {

    if (!this.state.submitted) {
      return <div class = "quiz">
      <h1>{this.course}</h1>
      <h2>{"Quiz for module " + this.state.quizData.moduleNum} </h2>
      <hr/>
      <form onSubmit = {this.handleSubmit}>
      <div class = "questions">
        {this.state.questions}
      </div>
      <hr/>
      <p> {this.state.quizData.introduction} </p>
      <input type="submit" value="Submit" onClick={this.handleAdvanceClick}/>
      <br/>
      <p class="passingPercentage">Minimum {(100 *this.state.quizData.passPercentage).toLocaleString(undefined, {minimumFractionDigits: 0})}% needed to pass </p>
      </form>
    </div>;
    } else {
      let message = <div><p>Sorry you have failed</p><br/><button type="button" onClick={this.previousModule}>Previous Module</button></div>;
      if (this.getQuizResult() >= this.state.quizData.passPercentage) {
        message = <div><p>Congratulations, you have passed!</p><br/><button type="button" onClick={this.nextModule}>Next Module</button></div>;
      }
      return <div><h1>{this.course}</h1>
      <h2>{"Quiz for module " + this.state.quizData.moduleNum} </h2>
      <hr/>
      <p>{"Score: " + (100 *this.getQuizResult()).toLocaleString(undefined, {maximumFractionDigits: 2}) + "%"}</p>
      {message}
      </div>;
    }

  }
}

export default QuizComponent;
