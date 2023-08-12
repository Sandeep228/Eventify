import React, { useState } from 'react';
import { ChakraProvider, Box, FormControl, FormLabel, Input, Textarea, Select, Button } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryContext, Image } from 'cloudinary-react';

const themes = [
  { value: 'theme1', label: 'Theme 1' },
  { value: 'theme2', label: 'Theme 2' },
  { value: 'theme3', label: 'Theme 3' },
];

// Add your Cloudinary configuration here
const cloudinaryConfig = {
  cloudName: 'dndorgct9',
  apiKey: '967523612336929',
  apiSecret: 'UFUbj4CcHCbBniV8VrDYv6-Q1sI',
};

function App() {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    theme: '',
    eventDate: '',
    image: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
  console.log('Setting', field, 'to', value);
  setFormData((prevData) => ({
    ...prevData,
    [field]: value,
  }));
};

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

const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true); // Start uploading
  
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ry2mqe7j');
  
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        const imageUrl = data.secure_url;
  
        handleInputChange('image', imageUrl); // Set the image URL in the form data
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false); // Finished uploading
      }
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
    // You can perform further actions here, like sending the data to a server.
  };

  const handleDateTimeChange = (e) => {
    const inputDate = e.target.value;
    const formattedDate = inputDate + ':00.000Z';
    handleInputChange('eventDate', formattedDate);
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
              onChange={(e) => handleInputChange('eventName', e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Theme</FormLabel>
            <Select
              value={formData.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
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
           {isUploading ? 'Uploading...' : 'Submit'}
          </Button>
        </form>
      </Box>
    </ChakraProvider>
  );
}

export default App;
