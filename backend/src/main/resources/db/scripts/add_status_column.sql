-- Add status column to blogs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blogs' AND column_name = 'status'
    ) THEN
        ALTER TABLE blogs ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';
        
        -- Update existing records based on their state
        -- Set blogs with published_at to PUBLISHED
        UPDATE blogs SET status = 'PUBLISHED' WHERE published_at IS NOT NULL;
        
        -- Set blogs with rejection_reason to REJECTED
        UPDATE blogs SET status = 'REJECTED' WHERE rejection_reason IS NOT NULL;
        
        -- Set all other blogs without status to DRAFT
        UPDATE blogs SET status = 'DRAFT' WHERE status = 'DRAFT';
    END IF;
END $$;
