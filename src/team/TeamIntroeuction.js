import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { ManufactureDate } from '../post-management/datetime';

const TeamIntroduction = (props) => {
    const { masterId, createTime, followerCount, memberCount } = props;

    const dateTime = ManufactureDate(createTime);

    return (
      <Box>
        <Typography>π λ§μ€ν°λ {masterId}λμλλ€.</Typography>
        <Typography>π {dateTime}μ μμ±λμμ΅λλ€.</Typography>
        <Typography>β­ {followerCount}λͺμ΄ νλ‘μ°νκ³  μμ΅λλ€.</Typography>
        <Typography>π¨βπ§βπ§ {memberCount}λͺμ λ©€λ²κ° μ°Έμ¬ μ€μλλ€.</Typography>
      </Box>
    );
};

export default TeamIntroduction;
