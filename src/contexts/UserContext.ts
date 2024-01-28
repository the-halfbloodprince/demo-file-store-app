import { User } from '@supabase/supabase-js';
import { createContext } from 'react';

export const userContext = createContext<User | null | undefined>(null);
