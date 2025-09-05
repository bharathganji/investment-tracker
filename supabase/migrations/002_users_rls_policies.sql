-- Create policies for RLS
CREATE POLICY "Users can view their own data"
ON public.users FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own data"
ON public.users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own data"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());