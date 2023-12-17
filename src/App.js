import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const App = () => {
  //state variables
  //logic - sequence, step, operation
  const [logic, setLogic] = React.useState({
    sequence: [
      2, 10, 5, 1, 0, 11, 4, 3, 6, 9, 8, 7 //default sequence of fact families
    ],
    step: -1, //default step, will step forward to 0 to generate first problem
    operation: 0 //begins with multiplication
  });
  
  //problem - numbers, answer, startTime
  const [problem, setProblem] = React.useState({
    num1: 0, // First number in the problem
    num2: 0, // Second number in the problem
    userAnswer: '', // User's answer to the problem
    startTime: 0 // Timestamp when the problem started
    // Other problem-related settings can be added as needed
  });
  
  //messages = message1, message2, countdown
  const [messages, setMessages] = React.useState({
    message1: 'Solve it!', // Message to be displayed for the user, either a "Solve it!" prompt or a correction prompt after a mistake
    message2: 'Analyzing...', // Another message for the user, either "Analyzing" before entering practice mode or sharing the fact family in practice mode
    countdown: ' ', // Countdown display to track remaining problems once the user enters practice mode, or an empty string if not used
  });
  
  //displaysettings
  const [displaySettings, setDisplaySettings] = React.useState({
    showContent: false, // Determines whether to show the main content or introduction
    totalProblems: 28, // Total number of problems the user will encounter
    switch: false, // boolean signaling that a user got a question wrong, and should switch modes once corrected
    switched: false // boolean signaling that practice mode has begun
  });
  
  const [holdData, setHoldData] = React.useState({
    hold: false, //hold a problem to repeat because the user got it wrong or answered slowly
    held: [] //problem to repeat
  });

  const checkAnswer = () => {

  };

  const handleReadyClick = () => {
    //generateProblem(); // Call the generateProblem function
    setDisplaySettings({
      ...displaySettings,
      showContent: true
    });
  };

  return (
    <div className="app" id="app">
      {logic.step <= displaySettings.totalProblems ? (
        !displaySettings.showContent ? (
          <Introduction onReadyClick={handleReadyClick} /> //display intro text and button
        ) : (
          <ProblemDisplay //display problem and messages
            operation={logic.operation} 
            num1={problem.num1}
            num2={problem.num2}
            userAnswer={problem.userAnswer}
            startTime={problem.startTime}
            message1={messages.message1}
            message2={messages.message2}
            countdown={messages.countdown}
            checkAnswer={checkAnswer}
            setUserAnswer={(updatedAnswer) =>
              setProblem({ ...problem, userAnswer: updatedAnswer })}
          />
        )
      ) : (
        <CompletionMessage /> //you're done for the day
      )}
    </div>
  );
};

const Introduction = ({ onReadyClick }) => {
  return (
    <div className="container">
      <h1>Welcome to Pulse</h1>
      <button className="ready-btn" onClick={onReadyClick}>Ready?</button>
    </div>
  );
};

const ProblemDisplay = ({
    operation,
    num1,
    num2,
    userAnswer,
    setUserAnswer,
    checkAnswer,
    message1,
    message2,
    countdown
  }) => {
  const ans = num1 * num2;

  let displayEquation, result;
  if (operation === 0 || operation === 4) {
    displayEquation = `${num1} × ${num2} = `;
    result = '';
  } else if (operation === 1) {
    displayEquation = `${num1} × `;
    result = `= ${ans}`;
  } else if (operation === 2) {
    displayEquation = `${ans} ÷ ${num1} = `;
    result = '';
  } else {
    displayEquation = `${ans} ÷ `;
    result = ` = ${num1}`;
  }

  return (
    <div className="practice">
      <div className="problem-display">{displayEquation} <Input userAnswer={userAnswer} setUserAnswer={setUserAnswer} checkAnswer={checkAnswer} /> {result}
      </div>
      <p className="message-display">{message1}</p>
      <p className="message-display">{message2}</p>
      <p className="message-display">{countdown}</p>
    </div>
  );
};



const Input = ({ userAnswer, setUserAnswer, checkAnswer }) => {
  const inputRef = React.useRef(null); // Create a ref for the input element
  
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the input when the component mounts
    }
  }, []); // Empty dependency array ensures the effect runs only once after initial render
  
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value); // Call the setUserAnswer function passed from ProblemDisplay
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer(); // Call checkAnswer when the Enter key is pressed
    }
  };
  
  return (
    <div>
      <input
        type="number"
        value={userAnswer}
        onChange={handleInputChange} // Handle the onChange event
        onKeyPress={handleKeyPress} // Trigger handleKeyPress on key press
        ref={inputRef} // Assign the ref to the input element
      />
    </div>
  );
};

const CompletionMessage = () => {
  return (
    <div>
      <h1>Nice! You're done for today.</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
