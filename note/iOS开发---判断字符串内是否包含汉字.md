 废话不多说直接上代码:

    -(BOOL) isChinese:(NSString *) str
    {
        for(int i=0; i< [str length];i++)
        {
            int a = [str characterAtIndex:i];
            if( a > 0x4E00 && a < 0x9FFF)
            {
                return YES;
            }
        }
        return NO;
    }
