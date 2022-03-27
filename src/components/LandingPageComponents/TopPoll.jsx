import { Typography, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Mainpollcard from "./PollCards/MainPollCard";
import { useNavigate } from "react-router-dom";

const TopPoll = () => {
  const navigate = useNavigate();

  const [newestPoll, setNewestPoll] = useState([]);

  useEffect(() => {
    axios
      .get("http://mapocracy-api.azurewebsites.net/poll?order=new")
      .then((res) => res.data)
      .then((result) => {
        return setNewestPoll(result[1]);
      });
  }, []);

  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h5">
        What's New?
      </Typography>
      <Paper
        className="main-card"
        onClick={() => navigate(`/polls/${newestPoll.id}`)}
        sx={{
          minHeight: "400px",
          boxSizing: "border-box",
          padding: "2%",
          border: "black solid 1px",

          position: "relative",
          "&:hover ": {
            boxSizing: "border-box",

            outline: "purple solid 2px",
            border: "purple solid 1px",

            cursor: "pointer",
            outlineOffset: "-10px",
          },
        }}
      >
        {newestPoll.id && <Mainpollcard poll={newestPoll} />}
      </Paper>
    </>
  );
};

export default TopPoll;
