function goToPage763(mySelect)
{
    PageIndex2=mySelect.selectedIndex;
    {
	if (mySelect.options[PageIndex2].value != "none")
	{
	    frames['iframe2'].location.href = mySelect.options[PageIndex2].value;
	}
	
    }
}
