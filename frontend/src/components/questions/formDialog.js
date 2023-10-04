import '../../App.css';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import FormAddCategories from './formAddCategories';
import FormComplexitySelect from './formComplexitySelect';

function FormDialog({ questions, setQuestions, addQuestionToDb }) {
  const [open, setOpen] = useState(false);
  // below are input references used for the form dialog
  const titleRef = useRef();
  const descRef = useRef();
  const [categories, setCategories] = useState([]);
  const [complexity, setComplexity] = useState("Easy");
  const [isModerator, setIsModerator] = useState(false);
 
  // handle toggling the form dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddQuestion = (event) => {
    event.preventDefault(); // prevent page from refreshing

    const maxId = questions.reduce((max, question) => {
      return question.id > max ? question.id : max;
    }, 0);
    const idValue = maxId + 1;

    // prevent adding if question title already exists
    if (questions.some((question) => question.title.toLowerCase() === titleRef.current.value.toLowerCase())) {
      console.log('Question with this title already exists');
      alert('Question with this title already exists. Please enter another title.');
      return;
    }

    // map titles of categories into a regular array
    const categoriesToAdd = categories.map(category => category.title);

    // add question
    const newQuestion = {
      id: idValue,
      title: titleRef.current.value,
      description: descRef.current.value,
      categories: categoriesToAdd,
      complexity: complexity
    }
    addQuestionToDb(newQuestion);
    setQuestions([...questions, newQuestion]);
    setOpen(false);
  }

  useEffect(() => {
    const loggedInUser = Cookies.get('user');
    setIsModerator(false);
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);

        if (user.role !== 'user') {
          setIsModerator(true);                  
        } 
    }
  }, []);

  return (
    <div>
      {/* Button to add a new question */}
      {isModerator &&
        <Button variant="outlined" onClick={handleClickOpen}>
        Add new question
        </Button>
      }
      
      {/* Form dialog box to submit a question */}
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a new question</DialogTitle>

      <form onSubmit={handleAddQuestion}>
        <DialogContent>
          <DialogContentText>
            Enter the details of your new question here.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="standard"
            inputRef={titleRef}
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            multiline
            variant="standard"
            inputRef={descRef}
          />
          <FormAddCategories setCategories={setCategories} />
          <FormComplexitySelect complexity={complexity} setComplexity={setComplexity} />
        </DialogContent>

        {/* Buttons in the bottom right */}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>

      </Dialog>
    </div>
  );
}

export default FormDialog;