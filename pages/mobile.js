import { Box } from '@mui/material';
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Mobile() {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(() => false);
    }, 2000);
    return () => {
      clearTimeout();
      setLoading(() => true);
    };
  }, []);

  const brand = ['AMD', 'Acer', 'Lenovo', 'Nokia'];

  const initialState = [
    { key: 'brand', label: [...brand] }
  ];

  const [chipData, setChipData] = React.useState(initialState[0].label);

  const ref = React.useRef([]);

  const checkboxvalue = (e) => {
      console.log(e.target.value)
  }

  const Unchecked = (e) => {

      console.log(ref.current, e.target.value)
      for (let i = 0; i < ref.current.length; i++) {

          ref.current[i].checked = false;
      }

  }

  return (
    <React.Fragment>
      {
        loading ?
        <Backdrop
          sx={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: '#fff', zIndex: 5000, m: 'auto', display: 'flex', flexWrap: 'wrap' }}
          open={loading}
        >
          <Image
            width={670}
            height={670}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            src="/images/banners/E-Commerce_mobile.jpg"
            alt="E-Commerce_mobile banner"
            quality={85}
          />
        </Backdrop>
        :
        <Box sx={{ my: 4 }}>
          <div style={{ width: '50%', backgroundColor: '#f7f4f3', marginLeft: '150px', marginTop: '100px', padding:'50px 0px 100px 50px' }}>
            {
              brand.map(x => (
                <input ref={(element) => { ref.current[x] = element }} value={x} type='checkBox' onChange={checkboxvalue } />
              ))
            }

            {
              brand.map(chip => (
                <button value={chip} key={chip} style={{ padding: '5px', color: 'white', backgroundColor: 'green', border: 'none', margin:'5px 5px 5px 5px' }} onClick={Unchecked}>{chip}</button>
              ))
            }
          </div>
        </Box>
      }
    </React.Fragment>
  )
}