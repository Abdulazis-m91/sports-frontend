const Footer = () => (
  <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
    <div className="content-container py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
      <span>Sports App © {new Date().getFullYear()}</span>
      <span>Data by TheSportsDB</span>
    </div>
  </footer>
);

export default Footer;
