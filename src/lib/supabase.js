import { createClient } from "@supabase/supabase-js";

// masukan string yang ada di website supabase 

const supabaseUrl = 'https://stclvkdeyvxwpwkjtqez.supabase.co'
const supabaseKey = 'sb_publishable_4VUFYHISHGsBuvfJS4SFoA_CGbEYPKI'

// membuat koneksi client
export const supabase = createClient(supabaseUrl, supabaseKey)