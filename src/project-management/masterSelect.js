import {
    Avatar,
    Box,
    Button,
    Container,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
    withStyles,
  } from '@material-ui/core';
  import {
    CheckBox,
    CheckBoxOutlineBlank,
    Search,
  } from '@material-ui/icons';
  import React, { useEffect, useState } from 'react';
import { DelegateProjectMaster } from './projectapi';

  const StyledList = withStyles({
    root: {
      height: 256,
      overflow: 'auto',
    },
  })(List);

  const MasterSelect = ({
    projectId,
    currentMaster,
    setCurrentMaster,
    handleClose,
  }) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedMaster, setSelectedMaster] = useState([]);
    const [searchString, setSearchString] = useState('');
    console.log(setError);

    useEffect(() => {
      (async () => {
        let result;
        try {
          const response = await fetch(`/api/projects/${projectId}/members`, {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' },
          });
          result = await response.json();
        } catch (e) {
          setIsLoaded(false);
          return;
        }
        setUsers(result);
        setSelectedMaster(currentMaster);
        setIsLoaded(true);
      })();
    }, []);

    if (error) {
      return `Error: ${error.message}`;
    }

    if (!isLoaded) {
      return 'Loading...';
    }

    const toggleSelectedUserId = (userId) => {
      if (selectedMaster.includes(userId)) {
        setSelectedMaster(currentMaster);
      } else {
        setSelectedMaster([userId]);
      }
    };

    const saveSelectedUsers = async () => {
      const selectedMasterId = selectedMaster[0];
      const newMaster = users.find((user) => user.id === selectedMasterId);

      const response = await DelegateProjectMaster(projectId, newMaster.id);
      if (response.status === 200) {
          console.log('ok');
          setCurrentMaster(newMaster);
          handleClose();
      }
    };

    return (
      <Container minWidth="sm">
        <Box display="flex" justifyContent="center">
          <Typography>선택된 마스터</Typography>
        </Box>
        <Box
          width="23vw"
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          gridGap="4px"
          height="128px"
          overflow="auto"
          bgcolor="#F8F8F8"
        >
          {selectedMaster.length === 0 && (
            <Typography color="primary">-</Typography>
          )}
          {selectedMaster.map((selectedUserId) => {
            const user = users.find((master) => master.id === selectedUserId);
            return (
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={user.name} src={user.profileImgPath} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />

                </ListItem>
              </>
            );
          })}
        </Box>

        <TextField
          fullWidth
          type="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          placeholder="이름으로 검색"
          value={searchString}
          onChange={(event) => {
            setSearchString(event.target.value);
          }}
        />

        <StyledList dense>
          {users
            .filter((user) => user.name.includes(searchString))
            .map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => {
                  toggleSelectedUserId(user.id);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.profileImgPath} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                {selectedMaster.includes(user.id) ? (
                  <CheckBox color="primary" />
                ) : (
                  <CheckBoxOutlineBlank color="primary" />
                )}
              </ListItem>
            ))}
        </StyledList>

        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          gridGap="8px"
          padding="8px"
          bgcolor="#F8F8F8"
        >
          <Button variant="contained" color="primary" onClick={saveSelectedUsers}>
            확인
          </Button>
          <Button onClick={handleClose} variant="contained">
            취소
          </Button>
        </Box>
      </Container>
    );
  };

  export default MasterSelect;
