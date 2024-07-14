import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const ProjectDetails = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-bold">Section</TableHead>
            <TableHead className="font-bold">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Introduction</TableCell>
            <TableCell>- Notre application vise à permettre aux utilisateurs de créer, copier et gérer des stratégies dans la finance décentralisée (DeFi).
              <br></br>- Notre mission est de simplifier et démocratiser l&apos;accès aux opportunités DeFi tout en offrant des outils avancés de suivi et de gestion.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Fonctionnalités Clés</TableCell>
            <TableCell>- Création et gestion de stratégies DeFi. 
              <br></br>- Copy trading pour les utilisateurs souhaitant suivre des stratégies performantes. 
              <br></br>- Suivi des performances et visualisation détaillée.
              <br></br>- Edition et ajustement des stratégies.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Rôles Utilisateurs</TableCell>
            <TableCell>- <span className="font-bold">Strategy Makers:</span> Utilisateurs qui créent et partagent des stratégies 
              <br></br>- <span className="font-bold">Strategy Followers:</span> Utilisateurs qui suivent et copient les stratégies des Strategy Makers.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Intégration avec Aave</TableCell>
            <TableCell>- Utilisation du protocole Aave pour les prêts et les emprunts. 
              <br></br>- Accès à des taux d&apos;intérêt compétitifs et à des opportunités de rendement.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Token de Gouvernance (DAO)</TableCell>
            <TableCell>- Introduction d&apos;un token de gouvernance pour participer aux décisions clés. 
              <br></br>- Récompenses et incitations pour les détenteurs de tokens.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Sécurité et Confiance</TableCell>
            <TableCell>- Mesures de sécurité robustes pour protéger les actifs des utilisateurs. 
              <br></br>- Transparence dans les opérations et le développement du projet.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Sécurité et Confiance</TableCell>
            <TableCell>- Mesures de sécurité robustes pour protéger les actifs des utilisateurs. 
              <br></br>- Transparence dans les opérations et le développement du projet.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Equipe et Partenaires</TableCell>
            <TableCell>- Présentation de l&apos;équipe de développement avec des profils LinkedIn. 
              <br></br>- Partenaires stratégiques et collaborations clés.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Roadmap</TableCell>
            <TableCell>- <span className="font-bold">Phase 1 :</span> Lancement de la version bêta et intégration avec Aave. 
              <br></br>- <span className="font-bold">Phase 2 :</span> Introduction du token de gouvernance et des fonctionnalités de &quot;copy trading&quot;.
              <br></br>- <span className="font-bold">Phase 3 :</span> Expansion des fonctionnalités et partenariats supplémentaires.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ProjectDetails;