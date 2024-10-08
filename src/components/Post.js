import React, { useState } from "react";
import {
  Stack,
  Input,
  Heading,
  Textarea,
  Text,
  Card,
  useTheme,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex
} from "@chakra-ui/react";
import CustomButton from "./Button";
import GoogleMapComponent from "./Map";
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import { savePost } from "../api-client/ApiClient";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import 'reactjs-popup/dist/index.css';

const Post = () => { 
  const theme = useTheme();
  const navigate = useNavigate();
  const [postName, setName] = useState("");
  const [originLng, setStartLng] = useState(0);
  const [originLat, setStartLat] = useState(0);
  const [destinationLng, setEndLng] = useState(0);
  const [destinationLat, setEndLat] = useState(0);
  const [startLocation, setStart] = useState("");
  const [endLocation, setEnd] = useState("");
  const [description, setDesc] = useState("");
  const [postError, setPostError] = useState("");
  const [mapSelection, setMapSelection] = useState("");
  const [price, setPrice] = useState(0);
  const [seatsAvailable, setSeats] = useState(0);
  const [mapDisabled, setMapDisabled] = useState(true);
  const [departureDate, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleStartChange = (e) => setStart(e.target.value);
  const handleEndChange = (e) => setEnd(e.target.value);
  const handleDescChange = (e) => setDesc(e.target.value);

  const handleDepartureChange = (e) => setDate(
    e.target.value
  );
  
  let formattedDate = "Select a date"
  if (departureDate) {
    formattedDate = departureDate;
  }

  const mapUses = {
    END: 'EndLocation',
    START: 'StartLocation',
    INACTIVE: '',
  };

  const handleSelectEndLocation = () => {
    if (mapSelection !== mapUses.END) {
      setMapDisabled(false)
      setMapSelection(mapUses.END)
    } else {
      setMapDisabled(true)
      setMapSelection(mapUses.INACTIVE)
    }
  };

  const handleSelectStartLocation = () => {
    if (mapSelection !== mapUses.START) {
      setMapDisabled(false)
      setMapSelection(mapUses.START)
    } else {
      setMapDisabled(true)
      setMapSelection(mapUses.INACTIVE)
    }
  };

  const useMap = (event) => {
    if (mapSelection === mapUses.END){
      setEnd("Lat: " + event.latLng.lat().toFixed(2) + ", Long:" + event.latLng.lng().toFixed(2))
      setEndLat(event.latLng.lat().toFixed(2))
      setEndLng(event.latLng.lng().toFixed(2))
    }
    if (mapSelection === mapUses.START){
      setStart("Lat: " + event.latLng.lat().toFixed(2) + ", Long:" + event.latLng.lng().toFixed(2))
      setStartLat(event.latLng.lat().toFixed(2))
      setStartLng(event.latLng.lng().toFixed(2))
    }
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSeatsChange = (e) => {
    setSeats(e.target.value);
  };

  const handlePost = async () => {

    const userRequest = {
      name: String(postName),
      originLng: Number(originLng),
      originLat: Number(originLat),
      destinationLng: Number(destinationLng),
      destinationLat: Number(destinationLat),
      description: String(description),
      departureDate: String(departureDate),
      price:  Number(price),
      seatsAvailable:  Number(seatsAvailable),
    };

    const result = await savePost(userRequest);
    if (result.error) {
      setPostError(result.error);
    } else {
      setPostError('');
			navigate('/');
    }
  };

  const isFormValid =
    postName &&
    originLng && originLat &&
    destinationLng && destinationLat &&
    departureDate && 
    description && 
    price &&
    seatsAvailable

  return (
    <Stack spacing={6} mt="8" mx="auto" fontFamily="CaviarDreams">

      <Card
        p="8"
        boxShadow="xl"
        w="fit-content"
        mx="auto"
        align="center"
        bg={theme.colors.accent}
        color={theme.colors.text}
      >
        <Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams" marginBottom="15px">
          Create a Post
        </Heading>

        <Stack direction="row" spacing={4} >
          <Stack spacing={4} width="xs" >

            <Input
              placeholder="Post Name"
              type="text"
              bg={theme.colors.background}
              onChange={handleNameChange}
              _placeholder={{ color: theme.colors.textLight }}
            />

            <InputGroup>
              <Input
                placeholder="Start Location"
                readOnly={true}
                value={startLocation}
                bg={theme.colors.background}
                onChange={handleStartChange}
                _placeholder={{ color: theme.colors.textLight }}
              />
              <InputRightElement width="3rem">
                <IconButton
                  size="sm"
                  icon={<FaMapMarkerAlt  />}
                  variant="link"
                  color={mapSelection === mapUses.START ? "red" : "gray"}
                  onClick={handleSelectStartLocation}
                />
              </InputRightElement>
            </InputGroup>

            <InputGroup>
              <Input
                placeholder="End Location"
                value={endLocation}
                readOnly={true}
                onChange={handleEndChange}
                bg={theme.colors.background}
                _placeholder={{ color: theme.colors.textLight }}
              />
              <InputRightElement width="3rem">
                <IconButton
                  size="sm"
                  icon={<FaMapMarkerAlt  />}
                  variant="link"
                  color={mapSelection === mapUses.END ? "red" : "gray"}
                  onClick={handleSelectEndLocation}
                />
              </InputRightElement>
            </InputGroup>

            <InputGroup>
              <Input
                onChange={handleDepartureChange}
                value={formattedDate}
                readOnly={true}
                bg={theme.colors.background}
                _placeholder={{ color: theme.colors.textLight }}
              />
              <InputRightElement width="3rem">
                <CiCalendarDate 
                  onClick={() => setOpen(true)} 
                  style={{ cursor: 'pointer' }} 
                  data-testid="calandar-button"/>
                <Popup
                  modal
                  closeOnDocumentClick
                  onClose={() => setOpen(false)}
                  open={open}
                  contentStyle={{
                    display: "flex",
                    justifyContent: "center",
                    width: "400px",
                    height: "400px",
                  }}
                >
                  <Stack spacing={4} width="lg" align="center">
                    <DayPicker
                      mode="single"
                      selected={departureDate}
                      onSelect={setDate}
                    />
                    <CustomButton
                      size="md"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      Select
                    </CustomButton>
                  </Stack>
                </Popup>
              </InputRightElement>
            </InputGroup>

            <Flex align="center">
                <h4 style={{ marginRight: '18px' }}>Number of Seats:</h4>
                <Input
                  onChange={handleSeatsChange}
                  placeholder="4"
                  type="number"
                  width="55%"
                  bg={theme.colors.background}
                  _placeholder={{ color: theme.colors.textLight }}
                />
              </Flex>

            <Textarea
              placeholder="Descripton"
              bg={theme.colors.background}
              onChange={handleDescChange}
              _placeholder={{ color: theme.colors.textLight }}
            />

          </Stack>
          <Stack spacing={4} width="lg" align="center">
            <GoogleMapComponent
              mapDisabled={mapDisabled}
              clicked={useMap}
              />

            <Stack direction="row" spacing={14}  >

              <Flex align="center">
                <h4 style={{ marginRight: '18px' }}>Price($):</h4>
                <Input
                  onChange={handlePriceChange}
                  placeholder="50.00"
                  bg={theme.colors.background}
                  _placeholder={{ color: theme.colors.textLight }}
                />
              </Flex>

              <CustomButton
                size="md"
                isDisabled={!isFormValid}
                onClick={handlePost}
              >
                Save Post
              </CustomButton>
            </Stack>
            {postError && <Text color="red.500">{postError}</Text>}

          </Stack>
        </Stack>

      </Card>
    </Stack>
  );
};

export default Post;
