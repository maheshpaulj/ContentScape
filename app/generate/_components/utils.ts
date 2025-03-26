export function copyToClipboard(text: string, successMessage: string) {
    navigator.clipboard.writeText(text);
    // Assuming toast is available globally or passed as a prop; here it's a placeholder
    console.log(successMessage); // Replace with actual toast implementation if needed
  }
  
  export function stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1")     // Remove italic/single *
      .replace(/__(.*?)__/g, "$1")     // Remove underline
      .replace(/#+\s/g, "")            // Remove headings
      .replace(/-\s/g, "");            // Remove bullet points
  }