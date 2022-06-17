import cvData from '../../../cv/resume.json'
import { renderToString } from 'react-cv';

export async function get() {
	const pdfblob = await renderToString(cvData)
}
