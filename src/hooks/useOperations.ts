import { useContext } from 'react';
import { OperationsContext } from '../context/OperationsContext';

export const useOperations = () => {
  return useContext(OperationsContext);
};
