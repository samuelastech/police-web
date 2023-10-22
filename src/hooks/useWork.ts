import { useContext } from 'react';
import WorkContext from '../context/WorkProvider';

export const useWork = () => {
  return useContext(WorkContext);
}
