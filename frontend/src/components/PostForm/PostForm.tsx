'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, MenuItem, Select, 
  FormControl, InputLabel, FormHelperText, 
  Link} from '@mui/material';

import { validPost } from '@/utils/validation';
import { postThread } from '@/api/thread';

// Component for the post form
function PostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '', category: '' });
  const [serverMsg, setServerMsg] = useState('');

  const categories = ['General', 'Tech', 'Art', 'Music', 'Gaming'];

  function resetFields() {
    setTitle('');
    setContent('');
    setCategory('');
    setErrors({ title: '', content: '', category: '' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate the form
    const { isValid, errors } = validPost(title, content, category);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    const postData = {
      "username": "admin",
      "title": title,
      "content": content,
      "category": category,
    };

    try {
      const response = await postThread(postData);
      setServerMsg(response.message)
    } catch (error) {
      console.error("Unexpected error: ", error);
      setServerMsg("Sorry, an unexpected error has occured.")
    }
  };

  function handleCancel() {
    resetFields();
    router.push("/")
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        bgcolor: 'background.default',
        padding: 3,
        display: 'flex',
        overflowY: 'auto', 
        marginBottom: 2, 
        marginTop: 6
      }}
    >
      {/* Form Box */}
      <Box 
        sx={{ 
          maxWidth: 600, 
          width: '100%',
          padding: 2, 
          borderRadius: 1, 
          alignSelf: {xxs: 'center', md: 'flex-start'},
        }}
      >
        {/* Title field */}
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />

        {/* Content field */}
        <TextField
          label="Content"
          fullWidth
          multiline
          minRows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          margin="normal"
          error={!!errors.content}
          helperText={errors.content}
        />

        {/* Category field */}
        <FormControl fullWidth margin="normal" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            defaultValue=""
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>
            
        {/* Submit and cancel buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: 2 }}>
          <Link
            href="/"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              cancel
            </Button>           
           </Link>
          <Button variant="contained" color="primary" type="submit">
            Post
          </Button>
        </Box>
        
        {/* Server message */}
        {serverMsg && <Box color='primary'>{serverMsg}</Box>}
      </Box>
    </Box>
  );
};

export default PostForm;
