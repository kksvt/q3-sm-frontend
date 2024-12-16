const ColorFormatter = (text) => {
    const sections = []
    let currentSection = '';
    let currentColor = '7';

    for (let i = 0; i < text.length; ++i) {
        if (i + 1 < text.length) {
            if (text[i] === '^' && (text[i + 1] >= '0' && text[i + 1] <= '9')) {
                if (currentSection !== '') {
                    sections.push({section: currentSection, color: currentColor});
                    currentSection = '';
                }
                currentColor = text[i + 1];
                ++i;
                continue;
            }
        }
        currentSection += text[i];
    }
    if (currentSection !== '') {
        sections.push({section: currentSection, color: currentColor});
    }

    const surroundWithColor = (text, color) => {
        switch (color) {
            case '0':
            case '8':
                return <span className='q3-black'>{text}</span>;
            case '1':
            case '9':
                return <span className='q3-red'>{text}</span>;
            case '2':
                return <span className='q3-green'>{text}</span>;
            case '3':
                return <span className='q3-yellow'>{text}</span>;
            case '4':
                return <span className='q3-blue'>{text}</span>;
            case '5':
                return <span className='q3-cyan'>{text}</span>;
            case '6':
                return <span className='q3-pink'>{text}</span>;
            default:
                return <span className='q3-white'>{text}</span>;
        }
    }

     return (
        <span>
            {sections.map((section) => {
                return surroundWithColor(section.section, section.color);
            })}
        </span>
    ); 
};

export default ColorFormatter;