let chime = new Audio(
  "https://95c4299bd7e6e57cacd63bc0daa40451.cdn.bubble.io/f1685661651799x595009985729566100/sleak-chime.mp3"
);

const supaUrl = "https://sygpwnluwwetrkmwilea.supabase.co";
const supaAnon =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z3B3bmx1d3dldHJrbXdpbGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUzMDIxNTQsImV4cCI6MjAyMDg3ODE1NH0.n2RSjgeqR-41wSO_IFuzPJKcc9bo1DbkXiPEsc1jO00";

console.log("start init supa client");

const client = supabase.createClient(supaUrl, supaAnon);

console.log("init supa client");

client
  .channel("room1")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: "message_type=eq.default_user",
    },
    (payload) => {
      console.log("Change received!", payload);
      chime
        .play()
        .catch((error) => console.error("Error playing chime:", error));
    }
  )
  .subscribe();
