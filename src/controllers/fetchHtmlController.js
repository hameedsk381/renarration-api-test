import axios from 'axios';
import cheerio from 'cheerio';
import juice from 'juice';
import { v4 as uuidv4 } from 'uuid';

export const downloadContent = async (request, reply) => {
    const { url } = request.body;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('link[rel="icon"], link[rel="shortcut icon"]').remove();
        $('svg').attr({ 'width': '50', 'height': '50' });
        $('*').each((index, element) => {
            const el = $(element);
            el.removeAttr('onmouseover').removeAttr('onmouseout');
            if (el.css('position') === 'fixed' || el.css('position') === 'sticky') {
                el.css('position', 'static');
            }
            const existingDataId = el.attr('data-id');
            el.attr('data-id', existingDataId || uuidv4());
        });

        const htmlContent = juice($.html());
        reply.header('Content-Type', 'text/html').send(htmlContent);
    } catch (error) {
        console.error(`This page cannot be renarrated at the moment: ${error}`);
        reply.status(500).send('This page cannot be renarrated at the moment');
    }
};
