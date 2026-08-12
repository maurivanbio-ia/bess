/**
 * Utility helper to handle file downloads with correct filenames, extensions, and MIME types.
 */
export const downloadBESSFile = (filename: string, docTitle?: string, docContentDetails?: string) => {
  const cleanName = filename || 'documento_bess.pdf';
  const extension = cleanName.includes('.') 
    ? cleanName.substring(cleanName.lastIndexOf('.')).toLowerCase() 
    : '.pdf';

  // For KMZ and KML files stored in public/kmz/
  if (extension === '.kmz' || extension === '.kml') {
    const kmzUrl = `/kmz/${cleanName}`;
    const link = document.createElement('a');
    link.href = kmzUrl;
    link.download = cleanName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Determine proper MIME type
  let mimeType = 'application/pdf';
  if (extension === '.docx' || extension === '.doc') {
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (extension === '.xlsx' || extension === '.xls') {
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (extension === '.txt') {
    mimeType = 'text/plain;charset=utf-8';
  }

  // Generate document Blob with official header content
  const content = `================================================================================
PLATAFORMA BESS | LICENCIAMENTO E GESTÃO AMBIENTAL (BRASOL x ECOBRASIL)
================================================================================

DOCUMENTO REGULATÓRIO: ${docTitle || cleanName}
NOME DO ARQUIVO: ${cleanName}
DATA DE EMISSÃO / EMISSÃO DIGITAL: ${new Date().toLocaleDateString('pt-BR')}

REGISTRO DE CONFORMIDADE:
--------------------------------------------------------------------------------
${docContentDetails || 'Certidão de conformidade e instrução de processo ambiental BESS.'}

================================================================================
Documento catalogado e emitido na Plataforma BESS Brasol x EcoBrasil
================================================================================`;

  const blob = new Blob([content], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = cleanName; // Ensures browser saves with original extension (.pdf, .docx, etc.)
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL after a short delay
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
};
