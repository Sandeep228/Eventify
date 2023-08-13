import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { CloudinaryContext, Image } from "cloudinary-react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "OPENAI_API",
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
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    theme: "",
    eventDate: "",
    venue:"",
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
  //   const handleImageChange = async (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       // Upload image to Cloudinary
  //       const formData = new FormData();
  //       formData.append('file', file);
  //       formData.append('upload_preset', 'react_test'); // Set your Cloudinary upload preset
  //       const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       const data = await response.json();
  //       const imageUrl = data.secure_url;
  //       handleInputChange('image', imageUrl);
  //     }
  //   };
  const [isGenerating, setIsGenerating] = useState(false);
  const generateDescriptionWithAI = async () => {
    setIsGenerating(true);
    try {
      const prompt = `write a paragraph about ${formData.eventName}`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500, // Adjust as needed
      });

      const description = response.data.choices[0].message.content;
      //const description = "dummy ses"
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
      setIsUploading(true); // Start uploading
      // Upload image to Cloudinary
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
        handleInputChange("image", imageUrl); // Set the image URL in the form data
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false); // Finished uploading
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
  mutation EventCreate($name: String! $description:String! $eventDate:DateTime $publishedAt:DateTime $theme:String $eventUrl:URL $host:ID){
    eventCreate(input: {name:$name description:$description eventDate:$eventDate publishedAt: $publishedAt theme:$theme eventUrl:$eventUrl host: {link:$host}}) {
      event {
       id
      }
    }
  }
  `;

  const getUserByEmailID = async(email) => {
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
  }

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
    const eventDate = formData.eventDate;
    const eventUrl = formData.image;
    const venue = formData.venue;
    const publishedAt = dateFormatter(Date.now())
    const userID = await getUserByEmailID(email);
    
    console.log(name," ",description," ",theme," ",eventDate," ",publishedAt," ",userID)
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
            host: userID
          },
        }),
      }
    );

    const result = await response.json();
    if(result.data!=null){
      console.log("event submitted successfully");
    }else{
      console.log("error in saving event");
    }
    return result;
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    //push new event to grafbase
    await postEventData(formData, user.email);
    setFormData({
      eventName: "",
      description: "",
      theme: "",
      eventDate: "",
      venue:"",
      image: null,
    });
  };
  const handleDateTimeChange = (e) => {
    const inputDate = e.target.value;
    const formattedDate = inputDate + ":00.000Z";
    handleInputChange("eventDate", formattedDate);
  };
  return (
    <ChakraProvider>
      <Box p={4}>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Name of Event</FormLabel>
            <Input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleInputChange("eventName", e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </FormControl>
          <Button
            type="button"
            onClick={generateDescriptionWithAI}
            colorScheme="blue"
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating..."
              : "Auto-generate description with AI"}
          </Button>
          <FormControl mb={4}>
            <FormLabel>Theme</FormLabel>
            <Select
              value={formData.theme}
              onChange={(e) => handleInputChange("theme", e.target.value)}
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
            <FormLabel>Event Venue</FormLabel>
            <Input
              type="text"
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Event Date</FormLabel>
            <Input
              type="datetime-local"
              value={formData.eventDate}
              onChange={handleDateTimeChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Image Upload</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.image && (
              <Image
                cloudName={cloudinaryConfig.cloudName}
                publicId={formData.image}
                width="100"
                crop="scale"
              />
            )}
          </FormControl>
          <Button type="submit" colorScheme="blue" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </form>
      </Box>
    </ChakraProvider>
  );
}
export default Form;
