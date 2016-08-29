import React, { PropTypes } from 'react';

import Button from '../Button';
import './index.css';


const PollQuestion = ({ answers, selected, handleClick }) => {
  return (
    <div className="poll-question">
      <header>
        <h2>Who would you like to see become the next US President?</h2>
      </header>

      <section className="main-content">
        {answers.map(({ id, name }) => (
          <Button
            key={id}
            value={id}
            toggled={selected === id}
            grouped
            onClick={handleClick}
          >
            {name}
          </Button>
        ))}
      </section>
    </div>
  );
};

PollQuestion.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  selected: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
};

export default PollQuestion;
