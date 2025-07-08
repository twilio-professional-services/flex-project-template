# Connie Documentation Site

This website is built using [Docusaurus 2](https://docusaurus.io/) and serves as the comprehensive documentation for the Connie platform, organized by user type and communication channels.

**Live Site**: https://docs.connie.one/

---

## 📁 Documentation Structure

The documentation follows a multi-audience approach with clear user pathways:

```
docs/
├── 00_introduction.md          # Landing page
├── getting-started/            # Quick start guides
├── feature-library/            # Technical feature documentation
├── building/                   # Template building guides
├── end-users/                  # End user documentation
│   ├── cbo-admins/            # CBO administrators
│   │   ├── getting-started.md
│   │   ├── voice/             # Voice channel services
│   │   │   └── call-forwarding/
│   │   │       ├── index.md   # Provider selection page
│   │   │       ├── cox-communications.md
│   │   │       └── xfinity-business.md
│   │   ├── messaging/         # Future: SMS, webchat
│   │   ├── socials/           # Future: Facebook, WhatsApp
│   │   ├── fax/               # Future: Fax services
│   │   └── email/             # Future: Email services
│   ├── supervisors/           # Team managers
│   └── staff-agents/          # Call center agents
└── developers/                # Developer documentation
    ├── general/               # Cross-cutting topics
    ├── frontend/              # React/TypeScript development
    └── backend/               # Serverless functions
```

---

## 🚀 Quick Start

### Local Development

```bash
cd docs
npm install
npm start
```

The site will be available at `http://localhost:3010`

### Deploy to Production

Changes pushed to the `main` branch automatically deploy to https://docs.connie.one/ via GitHub Actions.

---

## 📝 Adding New Content

### Adding a New Page

1. **Choose the correct location** based on your audience:
   - End users: `docs/end-users/[user-type]/`
   - Developers: `docs/developers/[area]/`
   - General: `docs/[category]/`

2. **Create the markdown file**:
   ```markdown
   ---
   sidebar_label: Short Name
   sidebar_position: 1
   title: "Full Descriptive Title"
   ---

   # Page Title

   Your content here...
   ```

3. **Follow content guidelines**:
   - Use clear, descriptive headings
   - Include prerequisites section for setup guides
   - Add troubleshooting sections where relevant
   - Use proper accessibility practices (alt text, logical heading hierarchy)

### Adding a New Category

1. **Create the directory structure**:
   ```bash
   mkdir -p docs/end-users/cbo-admins/new-channel
   ```

2. **Create `_category_.json`**:
   ```json
   {
     "label": "Channel Name",
     "position": 2,
     "collapsible": true,
     "collapsed": false,
     "description": "Brief description of the channel"
   }
   ```

3. **Update navigation** if using explicit sidebar configuration in `sidebars.js`

### Adding a New Communication Channel

For CPaaS services, follow the established pattern:

1. **Create channel directory**: `docs/end-users/cbo-admins/[channel-name]/`
2. **Add `_category_.json`** with proper label and position
3. **Create subcategories** as needed (e.g., `call-forwarding/`, `voicemail/`)
4. **Follow provider guide pattern**:
   - Overview/index page with provider selection
   - Individual provider guides (cox-communications.md, etc.)
   - Use provider logos in `/static/img/providers/`

---

## 🔗 Internal Linking Best Practices

### Use Docusaurus Link Component

For clickable elements (logos, buttons), always use the Link component:

```jsx
import Link from '@docusaurus/Link';

<Link to="/end-users/cbo-admins/voice/call-forwarding/cox-communications">
  <img src="/img/providers/cox-logo.png" alt="Cox Business" />
</Link>
```

### Markdown Links

For regular text links, use relative paths with `.md` extension:

```markdown
[Setup Guide](./cox-communications.md)
[Back to Overview](../index.md)
```

### Avoid These Common Mistakes

- ❌ Don't use `<a href="...">` tags for internal links
- ❌ Don't use absolute paths without the Link component
- ❌ Don't forget the `.md` extension for markdown links

---

## 🎨 Adding Provider Logos

1. **Save logo** to `/static/img/providers/provider-name.png`
2. **Optimize image** (recommended: 200px width max, transparent background)
3. **Use in provider selection**:
   ```jsx
   <Link to="/path/to/guide">
     <img 
       src="/img/providers/provider-name.png" 
       alt="Provider Name" 
       style={{maxWidth: '180px', maxHeight: '60px', objectFit: 'contain'}}
     />
   </Link>
   ```

---

## 📊 Content Organization Guidelines

### User-Focused Structure

- **CBO Admins**: Setup, configuration, management tasks
- **Supervisors**: Team management, reporting, oversight
- **Staff Agents**: Daily usage, features, troubleshooting
- **Developers**: Technical implementation, APIs, customization

### Channel-Based Organization

Group features by communication channel:
- **Voice**: Calls, forwarding, voicemail
- **Messaging**: SMS, webchat, automated responses
- **Socials**: Facebook Messenger, WhatsApp integration
- **Fax**: Fax services and management
- **Email**: Email integration and management

### Writing Guidelines

- **Plain language** for end users
- **Action-oriented** instructions
- **Accessibility-first** approach
- **Inclusive language** throughout

---

## 🚀 Deployment

### Automatic Deployment

- **Trigger**: Push to `main` branch
- **Platform**: GitHub Pages
- **URL**: https://docs.connie.one/
- **Build time**: ~2-3 minutes

### Manual Deployment Check

```bash
# Check build locally
npm run build

# Serve built site
npm run serve
```

### Troubleshooting Deployment

1. **Check GitHub Actions** in the repository for build errors
2. **Common issues**:
   - Broken internal links (will fail build)
   - Missing images or assets
   - Invalid markdown syntax
   - Sidebar configuration errors

---

## 🛠️ Development Tips

### Sidebar Configuration

- **Auto-generated**: Use `_category_.json` files (recommended)
- **Manual**: Edit `sidebars.js` for custom organization
- **Mixed approach**: Use both for complex structures

### Performance Optimization

- **Optimize images**: Use WebP format when possible
- **Lazy loading**: Large images load automatically
- **Search**: Built-in search is included and indexed

### Accessibility

- **Alt text**: Always include for images
- **Heading hierarchy**: Use logical h1→h2→h3 structure
- **Color contrast**: Ensure WCAG 2.1 AA compliance
- **Screen readers**: Test with NVDA or VoiceOver

---

## 📋 Content Checklist

Before publishing new content:

- [ ] Content is in the correct user section
- [ ] `_category_.json` files exist for new directories
- [ ] All images have descriptive alt text
- [ ] Internal links work correctly
- [ ] Content follows established patterns
- [ ] Builds successfully locally (`npm run build`)
- [ ] Follows accessibility guidelines

---

## 🆘 Getting Help

- **Docusaurus Docs**: https://docusaurus.io/docs
- **GitHub Issues**: Report problems in the repository
- **Content Guidelines**: See CLAUDE.md for architectural decisions

---

## 📈 Future Enhancements

Planned improvements:
- [ ] Multi-language support
- [ ] Advanced search with filtering
- [ ] Interactive tutorials
- [ ] Video integration
- [ ] Community contributions workflow

---

*This documentation site is continuously evolving. For major architectural changes, please update both this README and the CLAUDE.md file.*