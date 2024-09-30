import React, { useState } from "react";
import {
  Stack,
  Input,
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
import { createPost } from "../api-client/ApiClient";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import 'reactjs-popup/dist/index.css';

const Post = () => { 
  const theme = useTheme();
  const [postName, setName] = useState("");
  const [startLocation, setStart] = useState("");
  const [endLocation, setEnd] = useState("");
  const [description, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [postError, setPostError] = useState("");

  const [departureDate, setDate] = useState(null);
  let formattedDate = "Select a date"
  if (departureDate) {
    formattedDate = format(departureDate, 'PP');
  }

  const handleNameChange = (e) => setName(e.target.value);
  const handleStartChange = (e) => setStart(e.target.value);
  const handleEndChange = (e) => setEnd(e.target.value);
  const handleDescChange = (e) => setDesc(e.target.value);
  const handleDepartureChange = (e) => setDate(e.target.value);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    const priceRegex = /^[€£$]?\d{1,9}(,\d{3})*(\.\d{1,2})?$/;
    if (!priceRegex.test(e.target.value)) {
      setPriceError("Price is invalid");
    } else {
      setPriceError("");
    }
  };

  const handlePost = async () => {

    const userRequest = {
      postName,
      startLocation,
      endLocation,
      description,
      departureDate,
      price,
      priceError,
    };

    const result = await createPost(userRequest);
    if (result.error) {
      setPostError(result.error);
    }
  };

  const isFormValid =
    postName &&
    startLocation &&
    endLocation &&
    departureDate && 
    description && 
    price

  return (
    <Stack spacing={6} mt="8" mx="auto" fontFamily="CaviarDreams">

      <Card
        p="8"
        boxShadow="xl"
        w="fit-content"
        mx="auto"
        bg={theme.colors.accent}
        color={theme.colors.text}
      >
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
                bg={theme.colors.background}
                onChange={handleStartChange}
                _placeholder={{ color: theme.colors.textLight }}
              />
              <InputRightElement width="3rem">
                <IconButton
                  size="sm"
                  icon={<FaMapMarkerAlt  />}
                  variant="link"
                />
              </InputRightElement>
            </InputGroup>

            <InputGroup>
              <Input
                placeholder="End Location"
                onChange={handleEndChange}
                bg={theme.colors.background}
                _placeholder={{ color: theme.colors.textLight }}
              />
              <InputRightElement width="3rem">
                <IconButton
                  size="sm"
                  icon={<FaMapMarkerAlt  />}
                  variant="link"
                />
              </InputRightElement>
            </InputGroup>

            <InputGroup>
              <Input
                onChange={handleDepartureChange}
                value={formattedDate}
                bg={theme.colors.background}
                _placeholder={{ color: theme.colors.textLight }}
              />
              <InputRightElement width="3rem">
                <Popup
                  trigger={<CiCalendarDate  />} 
                  modal
                  closeOnDocumentClick
                  contentStyle={{
                    display: "flex",
                    justifyContent: "center",
                    width: "400px",
                    height: "400px",
                  }}
                >
                  <div style={{ display: "flex",  alignItems: "center" }}>
                    <DayPicker
                      mode="single"
                      selected={departureDate}
                      onSelect={setDate}
                    />
                  </div>
                </Popup>
              </InputRightElement>
            </InputGroup>

            <Flex align="center">
              <h4 style={{ marginRight: '18px' }}>Price($):</h4>
              <Input
                onChange={handlePriceChange}
                placeholder="50.00"
                bg={theme.colors.background}
                _placeholder={{ color: theme.colors.textLight }}
              />
            </Flex>
            {priceError && <Text color="red.500">{priceError}</Text>}

          </Stack>
          <Stack spacing={4} width="lg" >
            <GoogleMapComponent/>
            <Textarea
              placeholder="Descripton"
              bg={theme.colors.background}
              onChange={handleDescChange}
              _placeholder={{ color: theme.colors.textLight }}
            />

            <Stack direction="row" spacing={4} >
              <CustomButton
                size="md"
                isDisabled={true}
              >
                Delete Post
              </CustomButton>

              <CustomButton
                size="md"
                isDisabled={!isFormValid}
                onClick={createPost}
              >
                Create Post
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
