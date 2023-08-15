import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Flex,
  Stack,
  Text,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { Image } from "cloudinary-react";
import { Configuration, OpenAIApi } from "openai";
import { SiEventstore } from "react-icons/si";
import { useToast } from "@chakra-ui/react";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const themes = [
  { value: "Education", label: "Education" },
  { value: "Environmet", label: "Environment" },
  { value: "Technology", label: "Technology" },
  { value: "StudentWelfare", label: "Student Welfare" },
];
// Add your Cloudinary configuration here
const cloudinaryConfig = {
  cloudName: "dndorgct9",
  apiKey: "967523612336929",
  apiSecret: "UFUbj4CcHCbBniV8VrDYv6-Q1sI",
};
function Form() {
  const { user } = useAuth0();

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    theme: "",
    eventDate: "",
    venue: "",
    image: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const handleInputChange = (field, value) => {
    console.log("Setting", field, "to", value);
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  console.log(user);

  const [isGenerating, setIsGenerating] = useState(false);
  const generateDescriptionWithAI = async () => {
    setIsGenerating(true);
    try {
      const prompt = `write a paragraph about ${formData.eventName}`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50, // Adjust as needed
      });

      const description = response.data.choices[0].message.content;
      handleInputChange("description", description);
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ry2mqe7j");
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        const imageUrl = data.secure_url;
        handleInputChange("image", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const GetUserQuery = `
  query User($email: Email!) {
    user(by: {email:$email }) {
      id
    }
  }
`;

  const EventCreate = `
  mutation EventCreate($name: String! $description:String! $eventDate:DateTime $publishedAt:DateTime $theme:String $eventUrl:URL $venue:String $host:ID){
    eventCreate(input: {name:$name description:$description eventDate:$eventDate publishedAt: $publishedAt theme:$theme eventUrl:$eventUrl venue: $venue host: {link:$host}}) {
      event {
       id
      }
    }
  }
  `;

  const getUserByEmailID = async (email) => {
    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTE3NzcyNjYsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIN0pXR1gwUjVNN0ZQUjkzV1pNQUtGMzgiLCJqdGkiOiIwMUg3SldHWDhRNVlWTVc1RkI0RDJFQ1dTUiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.CnKts9fBm59UJw5enBJIgrXAIhLqvK_CGchRa--qw-Y",
        },
        body: JSON.stringify({
          query: GetUserQuery,
          variables: {
            email: email,
          },
        }),
      }
    );

    const result = await response.json();
    return result.data?.user?.id;
  };

  const dateFormatter = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return formattedDate;
  };

  const postEventData = async (formdata, email) => {
    const name = formData.eventName;
    const description = formData.description;
    const theme = formData.theme;
    const eventDate = formData.eventDate + ":00.000Z";
    const eventUrl = formData.image;
    const venue = formData.venue;
    const publishedAt = dateFormatter(Date.now());
    const userID = await getUserByEmailID(email);

    console.log(
      name,
      " ",
      description,
      " ",
      theme,
      " ",
      eventDate,
      " ",
      publishedAt,
      " ",
      userID
    );
    const response = await fetch(
      "https://eventify-main-pujaagarwal5263.grafbase.app/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTE3NzcyNjYsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIN0pXR1gwUjVNN0ZQUjkzV1pNQUtGMzgiLCJqdGkiOiIwMUg3SldHWDhRNVlWTVc1RkI0RDJFQ1dTUiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.CnKts9fBm59UJw5enBJIgrXAIhLqvK_CGchRa--qw-Y",
        },
        body: JSON.stringify({
          query: EventCreate,
          variables: {
            name: name,
            description: description,
            eventDate: eventDate,
            publishedAt: publishedAt,
            theme: theme,
            eventUrl: eventUrl,
            venue: venue,
            host: userID,
          },
        }),
      }
    );

    const result = await response.json();
    if (result.data != null) {
      console.log("event submitted successfully");
      toast({
        title: "Form Submitted",
        description: "Your form has been successfully submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      console.log(result);
      console.log("error in saving event");
    }
    return result;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //push new event to grafbase
    await postEventData(formData, user.email);
    setFormData({
      eventName: "",
      description: "",
      theme: "",
      eventDate: "",
      venue: "",
      image: null,
    });
  };
  const handleDateTimeChange = (e) => {
    const inputDate = e.target.value;
    handleInputChange("eventDate", inputDate);
  };
  const toast = useToast();
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box bg="black" p={4}>
      <Flex p={45}>
        <Box w="30%" p={35} bg="#131313" borderRadius=" 35px 0  0 35px">
          <Box bg="gray" w={29} h={31}>
            <Icon as={SiEventstore} h={5} w={6} color="white" mr="8px" m={1} />
          </Box>
          <Box mt={200}>
            <Heading size="xl" ml={63} mb={2} color="white">
              Eventify
            </Heading>
            <Text color="white" ml={63} fontSize={23}>
              Where AI shapes <br />
              events at your command
            </Text>
          </Box>
        </Box>
        <Flex direction="column" w="70%" p={4} bg="#242424">
          <Stack spacing={4}>
            <Box pl={100} pt={10}>
              <Box p={4}>
                <Heading color="white" pb={4}>
                  Create Your Event Details
                </Heading>
                <form onSubmit={handleSubmit}>
                  <FormControl mb={4}>
                    <FormLabel color="white">Name of Event</FormLabel>
                    <Input
                      color="white"
                      type="text"
                      value={formData.eventName}
                      onChange={(e) =>
                        handleInputChange("eventName", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl mb={5}>
                    <FormLabel color="white">Description</FormLabel>
                    <Textarea
                      color="white"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </FormControl>
                  <Button
                    mb={4}
                    type="button"
                    onClick={generateDescriptionWithAI}
                    bg="white"
                    disabled={isGenerating}
                  >
                    {isGenerating
                      ? "Generating..."
                      : "Craft with AI Magic  °☆."}
                  </Button>
                  <FormControl mb={4}>
                    <FormLabel color="white">Theme</FormLabel>
                    <Select
                      color="white"
                      value={formData.theme}
                      onChange={(e) =>
                        handleInputChange("theme", e.target.value)
                      }
                    >
                      <option value="">Select a theme</option>
                      {themes.map((theme) => (
                        <option key={theme.value} value={theme.value}>
                          {theme.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel color="white">Event Venue</FormLabel>
                    <Input
                      color="white"
                      type="text"
                      value={formData.venue}
                      onChange={(e) =>
                        handleInputChange("venue", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel color="white">Event Date</FormLabel>
                    <Input
                      color="white"
                      type="datetime-local"
                      value={formData.eventDate}
                      onChange={handleDateTimeChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel color="white">Image Upload</FormLabel>
                    <Input
                      color="white"
                      p={1}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.image && (
                      <Box mt="12px">
                        <Image
                          cloudName={cloudinaryConfig.cloudName}
                          publicId={formData.image}
                          width="100"
                          crop="scale"
                        />
                      </Box>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    bg="white"
                    mr={3}
                    onClick={handleGoBack}
                  >
                    Back
                  </Button>
                  <Button type="submit" bg="white" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Submit"}
                  </Button>
                </form>
              </Box>
            </Box>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
export default Form;
