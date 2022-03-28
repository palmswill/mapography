import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Avatar, Button } from "@mui/material";
// import ButtonBase from "@mui/material/ButtonBase";
import Arcmap from "../components/map/Arcmap";
import { Typography } from "@mui/material";

import axios from "axios";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { dotColor } from "../helpers/mapHelpers";
// import FormLabel from "@mui/material/FormLabel";
// import { fontSize } from "@mui/system";
// import { id } from "date-fns/locale";

// const Img = styled("img")({
//   margin: "auto",
//   display: "block",
//   maxWidth: "100%",
//   maxHeight: "100%",
// });

// const mockObj = {
//   id: "1",
//   name: "Which Name for My new Born Child?",
//   user: "William Liu",
//   description:
//     "I am gettting a new boy in 8 month! I have a list of baby names I would like to choose, pls help.",
//   answers: [
//     { id: "1", name: "Adamn" },
//     { id: "2", name: "John" },
//     { id: "3", name: "William" },
//   ],
//   votes: [
//     { answer_id: "1", cords: [-118.244, 34.052] },
//     { answer_id: "3", cords: [-118.245, 34.057] },
//     { answer_id: "1", cords: [-119.245, 33.057] },
//   ],
//   restriction: [[], [], [], []],
//   category: { id: "1", name: "animal" },
//   center: [-118.244, 34.052],
//   created_at: "2021-03-01",
//   start_at: "2021-03-01",
//   end_at: "2021-05-01",

//   visibility: true,
// };

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#18181B" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Polldisplay = (props) => {
  let navigate = useNavigate();
  const [poll, setPoll] = useState({});
  const { state } = useLocation();

  const { user, isAuthenticated } = useAuth0();
  // const { pollName } = props;

  let { pollid } = useParams();

  const color = dotColor;

  useEffect(() => {
    axios
      .get(`http://mapocracy-api.azurewebsites.net/poll/${pollid}`)
      .then((result) => result.data)
      .then((data) => setPoll(data));
  }, [pollid]);

  const handleRadioChange = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      alert("You need to login before to vote!");
      navigate("/");
    }

    const myFormData = new FormData(event.target);
    const values = Object.fromEntries(myFormData.entries());

    // this is the varible for post data.
    // const array = poll.answers;
    let post_poll_id = 0;
    let post_answer_id = 0;
    const post_answers = poll.answers;

    // I loop here for find the data to post regarding of the vote madded
    post_answers.forEach((element) => {
      if (element.content === values.quiz) {
        post_poll_id = element.poll_id;
        post_answer_id = element.id;
      }
    });
    const vote_added = {
      // user_id: user.email,
      poll_id: post_poll_id,
      answer_id: post_answer_id,
    };

    if (user) {
      vote_added.user_id = user.email;
    }

    axios
      .post(`http://mapocracy-api.azurewebsites.net/vote`, vote_added)
      // .then(() => navigate("/"))
      .catch((error) => {
        console.error("There was an error in vote adding process!", error);
      });

    // navigate("/");
  };

  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        maxWidth: 1424,
        fontSize: 12,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#18181B" : "#fff",
      }}
    >
      <div>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
          <Box
            gridColumn="span 12"
            spacing={{ xs: 1, md: 1 }}
            columns={{ xs: 2, sm: 10, md: 12 }}
          >
            {/* <Typography>{poll.answers && poll.answers[0] && poll.answers[0].content}</Typography> */}
            <Typography variant="h4">{poll.name}</Typography>

            <Typography variant="h6" color="primary">
              {poll.first_name && poll.last_name
                ? `${poll.first_name} ${poll.last_name}`
                : poll.first_name
                ? poll.first_name
                : poll.last_name
                ? poll.last_name
                : poll.user_id}
            </Typography>
            <Typography>{poll.description}</Typography>
          </Box>
          <Box gridColumn="span 4">
            <Item></Item>
          </Box>
        </Box>
      </div>
      <Grid container spacing={2}>
        <Grid item>
          <Box sx={{ minWidth: 900, minHeight: 350 }}>
            {poll.answers && (
              <Arcmap
                style={{ minHeight: "500px" }}
                center={[poll.longitude, poll.latitude]}
                voteList={poll.answers}
                zoom={10}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Box
                sx={{
                  border: "2px solid #000",
                  borderRadius: "10px",
                  boxShadow: 24,
                  bgcolor: "background.paper",
                  minHeight: "500px",
                  p: 9,
                }}
              >
                <form onSubmit={handleRadioChange}>
                  <FormControl
                    id="radios"
                    sx={{ m: 3, fontSize: 12 }}
                    variant="standard"
                    border={2}
                  >
                    <RadioGroup
                      sx={{ marginBottom: "20px" }}
                      aria-labelledby="radios"
                      name="quiz"
                    >
                      {poll.id &&
                        poll.answers.map((answer, index) => {
                          return (
                            <Box key={answer + index}>
                              <FormControlLabel
                                key={answer.id}
                                sx={{ fontSize: "24px" }}
                                value={answer.content}
                                control={<Radio />}
                                label={answer.content}
                              />
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: color[index],
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "10px",
                                  }}
                                >
                                  {" "}
                                </Avatar>
                                <Box sx={{ marginRight: "15px" }}>
                                  {" "}
                                  <i className="fa-solid fa-user"></i>
                                </Box>
                                <Typography>{answer.vote_count}</Typography>
                              </Box>
                            </Box>
                          );
                        })}
                    </RadioGroup>
                    <Button
                      sx={{ mt: 1, mr: 1 }}
                      type="submit"
                      variant="contained"
                    >
                      Submit your vote
                    </Button>
                  </FormControl>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Polldisplay;
