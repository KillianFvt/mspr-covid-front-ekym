import pandas as pd
import sys
import os

def clean_data(input_file, output_file=None):

    try:
        print(f"Lecture du fichier {input_file}...")
        df = pd.read_csv(input_file)
        colonnes_initiales = len(df.columns)

        # Supprimer les colonnes contenant 'smoothed'
        colonnes_a_supprimer_smoothed = [col for col in df.columns if 'smoothed' in col.lower()]
        df = df.drop(columns=colonnes_a_supprimer_smoothed)

        # Supprimer les colonnes qui contiennent moins de 75% de données
        seuil_donnees = 0.75
        pourcentage_valeurs_non_nulles = df.count() / len(df)
        colonnes_a_supprimer_nulles = pourcentage_valeurs_non_nulles[pourcentage_valeurs_non_nulles < seuil_donnees].index.tolist()
        df = df.drop(columns=colonnes_a_supprimer_nulles)

        # Nombre total de colonnes supprimées
        total_colonnes_supprimees = len(colonnes_a_supprimer_smoothed) + len(colonnes_a_supprimer_nulles)

        # Supprimer les lignes sans continent, location ou date
        lignes_initiales = len(df)
        df = df.dropna(subset=['continent', 'location', 'date'])
        lignes_supprimees = lignes_initiales - len(df)

        if not output_file:
            base, ext = os.path.splitext(input_file)
            output_file = f"{base}_cleaned{ext}"

        df.to_csv(output_file, index=False)

        print(f"Nettoyage terminé.")
        print(f"Colonnes 'smoothed' supprimées: {len(colonnes_a_supprimer_smoothed)}")
        print(f"Colonnes avec moins de 75% de données supprimées: {len(colonnes_a_supprimer_nulles)}")
        print(f"Total colonnes supprimées: {total_colonnes_supprimees}")
        print(f"Lignes sans continent, location ou date supprimées: {lignes_supprimees}")
        print(f"Colonnes initiales: {colonnes_initiales}")
        print(f"Colonnes restantes: {len(df.columns)}")
        print(f"Lignes initiales: {lignes_initiales}")
        print(f"Lignes restantes: {len(df)}")
        print(f"Fichier nettoyé enregistré sous: {output_file}")

        return True

    except Exception as e:
        print(f"Erreur lors du traitement du fichier: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python CleanData.py fichier_entree.csv [fichier_sortie.csv]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    clean_data(input_file, output_file)