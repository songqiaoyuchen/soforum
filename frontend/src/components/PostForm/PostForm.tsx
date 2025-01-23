'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Chip,
} from '@mui/material';

import { validPost } from '@utils/validInputs';
import { editThread, postThread } from '@api/thread';
import { Thread } from '@/types/thread';
import store from '@store';
import { showSnackbar } from '@store/slices/snackbarSlice';

function PostForm(props: {initialThread: Thread | null}) {
  const router = useRouter();
  const [title, setTitle] = useState(props.initialThread?.title ?? '');
  const [content, setContent] = useState(props.initialThread?.content ?? '');
  const [category, setCategory] = useState(props.initialThread?.category ?? '');
  const [tags, setTags] = useState<string[]>(props.initialThread?.tags ?? []);
  const [errors, setErrors] = useState({ title: '', content: '', category: '' });

  const categories = [
    'general',
    'technology',
    'science',
    'gaming',
    'movies',
    'music',
    'sports',
    'books',
    'art',
    'travel',
    'food',
    'academics',
  ];
  

  function resetFields() {
    setTitle(props.initialThread?.title || '');
    setContent(props.initialThread?.content || '');
    setCategory(props.initialThread?.category || '');
    setTags(props.initialThread?.tags || []);
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
      title,
      content,
      category,
      tags,
    };

    try {
      let response: {
        success: boolean;
        message: string;
      };
      if (props.initialThread) {
        response = await editThread(props.initialThread.id, postData);
      } else {
        response = await postThread(postData);
      }
      if (response.success) {
        store.dispatch(showSnackbar({message: 'Post successful', severity: 'success'}));
        router.push("/");
      } else {
        store.dispatch(showSnackbar({message: 'Post failed' + response.message, severity: 'error'}));
        resetFields();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      store.dispatch(showSnackbar({message: 'Post failed: Unexpected error', severity: 'error'}));
    }
  }

  function handleCancel() {
    resetFields();
    router.push('/');
  }

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
        marginTop: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: '100%',
          padding: 2,
          borderRadius: 1,
        }}
      >
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

        <FormControl fullWidth margin="normal" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={tags}
          onChange={(event, newValue) => setTags(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={option}
                  label={`#${option}`}
                  {...tagProps}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: '5px',
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" },
                  }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Tags" />
          )}
          sx={{margin: '10px 0px'}}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Post
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default PostForm;
