import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';

export default function CategoryCreate() {
  const [checked, setChecked] = React.useState([]);
  const [category, setCategory] = React.useState([]);

  React.useEffect(() => {
    const fetchCategories = async ()=> {
      const { data } = await axios.get('/api/category');
      setCategory(data);
    }
    fetchCategories();
  }, [])
  

  const handleChange1 = (event, index) => {
    const newChecked = [...checked];
    newChecked[index] = event.target.checked;
    setChecked(newChecked);
  };

  const handleChange2 = (event, index) => {
    const newChecked = [...checked];
    newChecked[index] = event.target.checked;
    setChecked(newChecked);
  };

  return (
    <div>
      {
        category?.map(item => (
          <Box key={item._id}>
            <FormControlLabel
              label={item?.categoryName}
              control={
                <Checkbox
                  checked={checked[0] && checked[1]}
                  indeterminate={checked[0] !== checked[1]}
                  onChange={handleChange1}
                />
              }
            />
            {
             item?.subCategory && item?.subCategory?.map(subItem => (
                <Box key={subItem._id} sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                  <FormControlLabel
                    label={subItem?.subCategoryName}
                    control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
                  />
                </Box>
              ))
            }
          </Box>
        ))
      }
    </div>
  );
}
