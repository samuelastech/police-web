import { useContext } from 'react';
import WorkContext from '../context/WorkProvider';

const useWork = () => {
  return useContext(WorkContext);
}

export default useWork;